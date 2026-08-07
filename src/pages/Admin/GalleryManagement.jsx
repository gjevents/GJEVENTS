import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ImagePlus, Loader2, RefreshCw, Trash2, Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const getCookie = (name) => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function GalleryManagement() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formState, setFormState] = useState({ section: "Events", title: "" });
  const [replaceTargetId, setReplaceTargetId] = useState(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/gallery/");
      if (!response.ok) throw new Error("Unable to load gallery images");
      const payload = await response.json();
      setImages(payload);
    } catch (error) {
      toast({ title: "Gallery load failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileSelection = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({ title: "Unsupported file", description: "Please upload JPG, JPEG, PNG or WEBP files only.", variant: "destructive" });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "File too large", description: "Maximum allowed size is 5MB.", variant: "destructive" });
      return;
    }

    if (preview) URL.revokeObjectURL(preview);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setFormState((current) => ({ ...current, title: file.name.replace(/\.[^/.]+$/, "") }));
  };

  const submitImage = async ({ method, endpoint, successTitle, successMessage, errorTitle, errorMessage }) => {
    if (!selectedFile) {
      toast({ title: errorTitle, description: errorMessage, variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("section", formState.section);
    formData.append("title", formState.title || selectedFile.name.replace(/\.[^/.]+$/, ""));

    setUploading(true);
    setUploadProgress(0);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, endpoint);
      const csrfToken = getCookie("csrftoken");
      if (csrfToken) {
        xhr.setRequestHeader("X-CSRFToken", csrfToken);
      }
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      });
      xhr.onload = () => {
        const payload = xhr.responseText ? JSON.parse(xhr.responseText) : {};
        if (xhr.status >= 200 && xhr.status < 300) {
          toast({ title: successTitle, description: successMessage, variant: "default" });
          resolve(payload);
        } else {
          toast({ title: errorTitle, description: payload.error || errorMessage, variant: "destructive" });
          reject(new Error(payload.error || errorMessage));
        }
        setUploading(false);
      };
      xhr.onerror = () => {
        toast({ title: errorTitle, description: errorMessage, variant: "destructive" });
        reject(new Error(errorMessage));
        setUploading(false);
      };
      xhr.send(formData);
    });
  };

  const uploadImage = async () => {
    try {
      const payload = await submitImage({
        method: "POST",
        endpoint: "/api/gallery/",
        successTitle: "Image uploaded",
        successMessage: "The gallery image is now live.",
        errorTitle: "Upload failed",
        errorMessage: "The image could not be uploaded.",
      });
      setImages((current) => [payload, ...current]);
      setSelectedFile(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      setFormState({ section: "Events", title: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const replaceImage = async (imageId) => {
    try {
      const payload = await submitImage({
        method: "PUT",
        endpoint: `/api/gallery/${imageId}/`,
        successTitle: "Image replaced",
        successMessage: "The replacement image has been saved.",
        errorTitle: "Replacement failed",
        errorMessage: "The replacement image could not be saved.",
      });
      setImages((current) => current.map((item) => (item.id === imageId ? payload : item)));
      setSelectedFile(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      setFormState({ section: "Events", title: "" });
      setReplaceTargetId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteImage = async (imageId) => {
    try {
      const response = await fetch(`/api/gallery/${imageId}/`, {
        method: "DELETE",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Delete failed");
      setImages((current) => current.filter((item) => item.id !== imageId));
      toast({ title: "Image removed", description: "The gallery image has been deleted.", variant: "default" });
    } catch (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.18),_transparent_55%)] px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="glass-card gilded-edge overflow-hidden rounded-[2rem] border border-gold/20 p-6 shadow-2xl sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-600">Admin Module</p>
              <h1 className="mt-2 font-serif-display text-3xl text-amber-900 sm:text-4xl">Gallery Management</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">Upload, preview, replace, and remove gallery images while keeping every card perfectly fitted to the website layout.</p>
            </div>
            <button onClick={fetchImages} className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-600/30 bg-white/80 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[1.5rem] border border-amber-100 bg-white/70 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif-display text-2xl text-amber-900">Upload or replace</h2>
                  <p className="mt-1 text-sm text-slate-600">Supports JPG, JPEG, PNG, and WEBP up to 5MB.</p>
                </div>
                <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">{images.length} images</div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Section
                  <input value={formState.section} onChange={(event) => setFormState({ ...formState, section: event.target.value })} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0" placeholder="Events" />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Image title
                  <input value={formState.title} onChange={(event) => setFormState({ ...formState, title: event.target.value })} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0" placeholder="Luxury reception" />
                </label>
              </div>

              <label className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.5rem] border border-dashed border-amber-400/70 bg-amber-50/80 px-4 py-8 text-center transition hover:bg-amber-100">
                <ImagePlus className="h-10 w-10 text-amber-700" />
                <span className="text-sm font-semibold text-amber-800">Choose image to upload</span>
                <span className="text-xs text-slate-600">Preview will appear below before you save</span>
                <input type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handleFileSelection} />
              </label>

              {preview ? (
                <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-amber-200 bg-slate-900/95 p-3">
                  <div className="relative h-64 w-full overflow-hidden rounded-[1.2rem]">
                    <img src={preview} alt="Selected preview" className="h-full w-full object-cover object-center" />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-200">
                    <span>{selectedFile?.name}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em]">Preview ready</span>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">Preview will appear here before saving.</div>
              )}

              {uploading ? (
                <div className="mt-6 rounded-[1.25rem] border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-800">
                  <div className="flex items-center justify-between">
                    <span>Uploading image…</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                    <div className="h-full rounded-full bg-amber-600 transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              ) : null}

              <button onClick={uploadImage} disabled={uploading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-70">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? "Uploading..." : "Upload Image"}
              </button>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950/95 p-4 text-slate-100 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-amber-500/20 p-2 text-amber-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif-display text-2xl">Image quality guardrails</h2>
                  <p className="mt-1 text-sm text-slate-400">Every upload is constrained to preserve the original quality and fit the card design without breaking the layout.</p>
                </div>
              </div>
              <div className="mt-6 space-y-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <div className="flex items-start gap-3"><AlertCircle className="mt-0.5 h-4 w-4 text-amber-400" /> <span>Images use the same CSS treatment as the live site: full width, full height, cover fit, centered.</span></div>
                <div className="flex items-start gap-3"><AlertCircle className="mt-0.5 h-4 w-4 text-amber-400" /> <span>Uploads stay in the Django media gallery folder and the public site reads them automatically.</span></div>
                <div className="flex items-start gap-3"><AlertCircle className="mt-0.5 h-4 w-4 text-amber-400" /> <span>Before saving, you can inspect the final frame to confirm the image looks correct in the card.</span></div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-2">
          {loading ? Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="glass-card rounded-[1.5rem] border border-amber-100 p-4">
              <Skeleton className="h-48 w-full rounded-[1.2rem]" />
              <Skeleton className="mt-4 h-4 w-2/3" />
              <Skeleton className="mt-3 h-4 w-1/2" />
            </div>
          )) : images.map((item) => (
            <motion.article key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card gilded-edge overflow-hidden rounded-[1.5rem] border border-amber-100">
              <div className="relative h-60 overflow-hidden bg-slate-900">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover object-center" />
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif-display text-xl text-amber-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">Section: {item.section}</p>
                  </div>
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">{formatDate(item.created_at)}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1">Uploaded {formatDate(item.created_at)}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">Updated {formatDate(item.updated_at)}</span>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <AlertDialog open={replaceTargetId === item.id} onOpenChange={(open) => setReplaceTargetId(open ? item.id : null)}>
                    <AlertDialogTrigger asChild>
                      <button onClick={() => setReplaceTargetId(item.id)} className="inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-white px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-50">
                        <RefreshCw className="h-4 w-4" /> Replace Image
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Replace this image?</AlertDialogTitle>
                        <AlertDialogDescription>Choose a new file above and confirm to swap the current gallery image.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => replaceImage(item.id)} className="bg-amber-600 hover:bg-amber-700">Replace</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100">
                        <Trash2 className="h-4 w-4" /> Delete Image
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this image?</AlertDialogTitle>
                        <AlertDialogDescription>This will remove it from the gallery and the public site immediately.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteImage(item.id)} className="bg-rose-600 hover:bg-rose-700">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
