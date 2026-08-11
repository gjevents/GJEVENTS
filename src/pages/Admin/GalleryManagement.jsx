import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, ImagePlus, Loader2, Pencil, RefreshCw, Save, Trash2, Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { B2B_PORTAL_URL } from "@/utils/constants";
import { apiCredentials, apiUrl, csrfHeaders, mediaUrl, parseApiResponse } from "@/lib/siteApi";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_MANAGED_IMAGES = 10;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const TABS = [
  { id: "hero", label: "Hero Images" },
  { id: "about", label: "About Images" },
  { id: "gallery", label: "Gallery" },
];

const HERO_DEFAULTS = {
  label_text: "LIVE EVENT",
  heading_line_1: "Experience Events",
  heading_line_2: "Like Never Before",
  description: "Professional Event Management | Premium Pass Distribution | Business Opportunities | Stall Bazaar",
  button_1_text: "Explore More",
  button_1_link: "#about",
  button_2_text: "Open B2B Portal",
  button_2_link: B2B_PORTAL_URL,
  label_color: "#D4AF37",
  heading_color: "#FFF8E7",
  secondary_heading_color: "#D4AF37",
  description_color: "#FFF8E7",
  button_text_color: "#3D2B1F",
  button_background_color: "#D4AF37",
  label_font_size: 12,
  heading_font_size: 88,
  description_font_size: 18,
  text_alignment: "center",
  text_position_x: 50,
  text_position_y: 50,
  image_position_x: 50,
  image_position_y: 50,
  image_zoom: 105,
};

const HERO_PREVIEW_MODES = [
  { id: "desktop", label: "Desktop", ratio: "16 / 9" },
  { id: "mobile", label: "Mobile", ratio: "9 / 16" },
  { id: "square", label: "Square", ratio: "1 / 1" },
];

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const validateFile = (file) => {
  if (!file) return "Please choose an image first.";
  if (!ACCEPTED_TYPES.includes(file.type)) return "Please upload JPG, JPEG, PNG or WEBP files only.";
  if (file.size > MAX_FILE_SIZE) return "Maximum allowed size is 5MB.";
  return "";
};

const makePayload = (item) => ({ ...item, image: mediaUrl(item.image) });

function CmsUploadPanel({ title, count, selectedFile, preview, uploading, uploadProgress, onFile, onUpload, maxCount = MAX_MANAGED_IMAGES }) {
  const hasLimit = Number.isFinite(maxCount);
  const isLimitReached = hasLimit && count >= maxCount;

  return (
    <div className="rounded-[1.5rem] border border-amber-100 bg-white/70 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif-display text-2xl text-amber-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-600">Supports JPG, JPEG, PNG, and WEBP up to 5MB.</p>
        </div>
        <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">{hasLimit ? `${count} / ${maxCount}` : `${count} images`}</div>
      </div>

      <label className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.5rem] border border-dashed border-amber-400/70 bg-amber-50/80 px-4 py-8 text-center transition hover:bg-amber-100">
        <ImagePlus className="h-10 w-10 text-amber-700" />
        <span className="text-sm font-semibold text-amber-800">Choose image to upload</span>
        <span className="text-xs text-slate-600">{hasLimit ? `Maximum ${maxCount} images allowed for this section` : "No CMS limit is applied to the existing gallery"}</span>
        <input type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={onFile} />
      </label>

      {preview ? (
        <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-amber-200 bg-slate-900/95 p-3">
          <div className="relative h-56 w-full overflow-hidden rounded-[1.2rem]">
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
            <span>Uploading image...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-amber-600 transition-all" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      ) : null}

      <button onClick={onUpload} disabled={uploading || isLimitReached} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-70">
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {isLimitReached ? `Maximum ${maxCount} images reached` : uploading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
}

function TextInput({ label, value, onChange, textarea = false }) {
  const Input = textarea ? "textarea" : "input";
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
      {label}
      <Input value={value || ""} onChange={(event) => onChange(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0" rows={textarea ? 3 : undefined} />
    </label>
  );
}

function ColorInput({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
      {label}
      <input type="color" value={value || "#ffffff"} onChange={(event) => onChange(event.target.value)} className="h-8 w-12 cursor-pointer rounded border-0 bg-transparent p-0" />
    </label>
  );
}

function RangeInput({ label, value, min = 0, max = 100, onChange }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
      <span className="flex justify-between"><span>{label}</span><span>{value}</span></span>
      <input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function HeroEditor({ item, onClose, onSave }) {
  const [draft, setDraft] = useState({ ...HERO_DEFAULTS, ...item });
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [showGrid, setShowGrid] = useState(true);
  const [finalPreview, setFinalPreview] = useState(false);
  const previewRef = useRef(null);
  const activePreview = HERO_PREVIEW_MODES.find((mode) => mode.id === previewMode) || HERO_PREVIEW_MODES[0];
  const alignItems = draft.text_alignment === "left" ? "flex-start" : draft.text_alignment === "right" ? "flex-end" : "center";
  const update = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  const handlePointer = (event) => {
    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect) return;
    update("text_position_x", Math.round(((event.clientX - rect.left) / rect.width) * 100));
    update("text_position_y", Math.round(((event.clientY - rect.top) / rect.height) * 100));
  };
  const save = async () => {
    setSaving(true);
    try {
      await onSave(draft);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl overflow-hidden rounded-[1.5rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="font-serif-display text-2xl text-amber-900">Hero Image Editor</h2>
            <p className="text-sm text-slate-500">Drag the overlay or use sliders to position text.</p>
          </div>
          <button onClick={onClose} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-amber-100 bg-amber-50/70 p-3">
              <div className="flex flex-wrap gap-2">
                {HERO_PREVIEW_MODES.map((mode) => (
                  <button key={mode.id} onClick={() => setPreviewMode(mode.id)} className={`rounded-full px-4 py-2 text-sm font-semibold ${previewMode === mode.id ? "bg-amber-600 text-white" : "bg-white text-slate-700"}`}>
                    {mode.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setShowGrid((value) => !value)} className={`rounded-full px-4 py-2 text-sm font-semibold ${showGrid ? "bg-slate-900 text-white" : "bg-white text-slate-700"}`}>
                  Grid
                </button>
                <button onClick={() => setFinalPreview((value) => !value)} className={`rounded-full px-4 py-2 text-sm font-semibold ${finalPreview ? "bg-emerald-600 text-white" : "bg-white text-slate-700"}`}>
                  Final Preview
                </button>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-3 shadow-2xl">
              <div ref={previewRef} onPointerDown={handlePointer} onPointerMove={(event) => event.buttons === 1 && handlePointer(event)} className="relative mx-auto max-h-[70vh] cursor-crosshair overflow-hidden rounded-[1.15rem] bg-slate-900" style={{ aspectRatio: activePreview.ratio }}>
              <img
                src={draft.image}
                alt="Hero editor preview"
                className="h-full w-full object-cover"
                style={{
                  objectPosition: `${draft.image_position_x}% ${draft.image_position_y}%`,
                  transform: `scale(${draft.image_zoom / 100})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-inkbrown/70 via-inkbrown/55 to-inkbrown/85" />
              {showGrid && !finalPreview ? (
                <div className="pointer-events-none absolute inset-0">
                  <span className="absolute left-1/3 top-0 h-full w-px bg-white/30" />
                  <span className="absolute left-2/3 top-0 h-full w-px bg-white/30" />
                  <span className="absolute left-0 top-1/3 h-px w-full bg-white/30" />
                  <span className="absolute left-0 top-2/3 h-px w-full bg-white/30" />
                  <span className="absolute inset-6 rounded-[1rem] border border-dashed border-white/25" />
                </div>
              ) : null}
              <div className="absolute flex max-w-[86%] flex-col" style={{ left: `${draft.text_position_x}%`, top: `${draft.text_position_y}%`, transform: "translate(-50%, -50%)", textAlign: draft.text_alignment, alignItems }}>
                <p className="mb-4 uppercase tracking-[0.35em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]" style={{ color: draft.label_color, fontSize: `clamp(10px, ${draft.label_font_size / 14}vw, ${draft.label_font_size}px)` }}>{draft.label_text}</p>
                <h3 className="font-heading font-bold leading-[1.05] drop-shadow-[0_4px_22px_rgba(0,0,0,0.55)]" style={{ color: draft.heading_color, fontSize: `clamp(34px, ${draft.heading_font_size / 16}vw, ${draft.heading_font_size}px)` }}>
                  {draft.heading_line_1}<br /><span style={{ color: draft.secondary_heading_color, WebkitTextFillColor: draft.secondary_heading_color }}>{draft.heading_line_2}</span>
                </h3>
                <p className="mt-5 max-w-2xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]" style={{ color: draft.description_color, fontSize: `clamp(12px, ${draft.description_font_size / 18}vw, ${draft.description_font_size}px)` }}>{draft.description}</p>
                <div className="mt-8 flex flex-wrap gap-4" style={{ justifyContent: draft.text_alignment === "left" ? "flex-start" : draft.text_alignment === "right" ? "flex-end" : "center" }}>
                  <span className="rounded-full border border-golden/50 px-6 py-3 text-xs uppercase tracking-[0.18em] text-cream">{draft.button_1_text}</span>
                  <span className="rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: draft.button_text_color, background: draft.button_background_color }}>{draft.button_2_text}</span>
                </div>
              </div>
              {!finalPreview ? (
                <div className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-slate-950/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                  {activePreview.label} banner preview
                </div>
              ) : null}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setDraft((current) => ({ ...current, text_position_x: 50, text_position_y: 50 }))} className="rounded-full border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700">Reset Text</button>
              <button onClick={() => setDraft((current) => ({ ...current, image_position_x: 50, image_position_y: 50, image_zoom: 105 }))} className="rounded-full border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700">Reset Image Fit</button>
            </div>
          </div>

          <div className="max-h-[34rem] space-y-5 overflow-y-auto pr-2">
            <TextInput label="Small/top label" value={draft.label_text} onChange={(value) => update("label_text", value)} />
            <TextInput label="Heading line 1" value={draft.heading_line_1} onChange={(value) => update("heading_line_1", value)} />
            <TextInput label="Heading line 2" value={draft.heading_line_2} onChange={(value) => update("heading_line_2", value)} />
            <TextInput label="Description" value={draft.description} textarea onChange={(value) => update("description", value)} />
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label="Button 1 text" value={draft.button_1_text} onChange={(value) => update("button_1_text", value)} />
              <TextInput label="Button 1 link" value={draft.button_1_link} onChange={(value) => update("button_1_link", value)} />
              <TextInput label="Button 2 text" value={draft.button_2_text} onChange={(value) => update("button_2_text", value)} />
              <TextInput label="Button 2 link" value={draft.button_2_link} onChange={(value) => update("button_2_link", value)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <ColorInput label="Label" value={draft.label_color} onChange={(value) => update("label_color", value)} />
              <ColorInput label="Heading" value={draft.heading_color} onChange={(value) => update("heading_color", value)} />
              <ColorInput label="Second heading" value={draft.secondary_heading_color} onChange={(value) => update("secondary_heading_color", value)} />
              <ColorInput label="Description" value={draft.description_color} onChange={(value) => update("description_color", value)} />
              <ColorInput label="Button text" value={draft.button_text_color} onChange={(value) => update("button_text_color", value)} />
              <ColorInput label="Button bg" value={draft.button_background_color} onChange={(value) => update("button_background_color", value)} />
            </div>
            <RangeInput label="Label font size" min={10} max={28} value={draft.label_font_size} onChange={(value) => update("label_font_size", value)} />
            <RangeInput label="Heading font size" min={42} max={116} value={draft.heading_font_size} onChange={(value) => update("heading_font_size", value)} />
            <RangeInput label="Description font size" min={12} max={30} value={draft.description_font_size} onChange={(value) => update("description_font_size", value)} />
            <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
              <p className="mb-4 text-sm font-semibold text-amber-900">Image fit and crop</p>
              <div className="space-y-4">
                <RangeInput label="Image zoom" min={100} max={160} value={draft.image_zoom} onChange={(value) => update("image_zoom", value)} />
                <RangeInput label="Image X position" value={draft.image_position_x} onChange={(value) => update("image_position_x", value)} />
                <RangeInput label="Image Y position" value={draft.image_position_y} onChange={(value) => update("image_position_y", value)} />
              </div>
            </div>
            <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-slate-200">
              {["left", "center", "right"].map((align) => (
                <button key={align} onClick={() => update("text_alignment", align)} className={`px-3 py-2 text-sm capitalize ${draft.text_alignment === align ? "bg-amber-600 text-white" : "bg-white text-slate-700"}`}>{align}</button>
              ))}
            </div>
            <RangeInput label="X position" value={draft.text_position_x} onChange={(value) => update("text_position_x", value)} />
            <RangeInput label="Y position" value={draft.text_position_y} onChange={(value) => update("text_position_y", value)} />
            <button onClick={save} disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-70">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ManagedSection({ type }) {
  const isHero = type === "hero";
  const endpoint = isHero ? "/api/hero-slides/" : "/api/about-images/";
  const reorderEndpoint = isHero ? "/api/hero-slides/reorder/" : "/api/about-images/reorder/";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editorItem, setEditorItem] = useState(null);

  const loadItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl(`${endpoint}?all=1`), { credentials: apiCredentials });
      const payload = await parseApiResponse(response, "The backend returned an unexpected response.");
      if (!response.ok) throw new Error(payload.error || `Unable to load images. HTTP status: ${response.status}.`);
      setItems(payload.map(makePayload));
    } catch (error) {
      toast({ title: "Load failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [type]);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const onFile = (event) => {
    const file = event.target.files?.[0];
    const error = validateFile(file);
    if (error) {
      toast({ title: "Invalid image", description: error, variant: "destructive" });
      return;
    }
    preview && URL.revokeObjectURL(preview);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const upload = async () => {
    if (items.length >= MAX_MANAGED_IMAGES) {
      toast({ title: "Limit reached", description: "Maximum 10 images allowed for this section.", variant: "destructive" });
      return;
    }
    const error = validateFile(selectedFile);
    if (error) {
      toast({ title: "Upload failed", description: error, variant: "destructive" });
      return;
    }
    const formData = new FormData();
    formData.append("image", selectedFile);
    if (isHero) Object.entries(HERO_DEFAULTS).forEach(([key, value]) => formData.append(key, value));
    setUploading(true);
    setUploadProgress(0);
    try {
      const headers = await csrfHeaders();
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", apiUrl(endpoint));
        xhr.withCredentials = apiCredentials === "include";
        Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));
        xhr.upload.addEventListener("progress", (event) => event.lengthComputable && setUploadProgress(Math.round((event.loaded / event.total) * 100)));
        xhr.onload = () => {
          try {
            const payload = xhr.responseText ? JSON.parse(xhr.responseText) : {};
            if (xhr.status >= 200 && xhr.status < 300) resolve(payload);
            else reject(new Error(payload.error || "Upload failed."));
          } catch {
            reject(new Error(`The backend returned an unexpected response. HTTP status: ${xhr.status}.`));
          }
        };
        xhr.onerror = () => reject(new Error("Network error while uploading."));
        xhr.send(formData);
      });
      toast({ title: "Image uploaded", description: "The image is now available for this section.", variant: "default" });
      setSelectedFile(null);
      preview && URL.revokeObjectURL(preview);
      setPreview(null);
      loadItems();
    } catch (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const patchItem = async (id, changes, success = "Changes saved successfully.") => {
    const headers = await csrfHeaders();
    const formData = new FormData();
    Object.entries(changes).forEach(([key, value]) => formData.append(key, value));
    const response = await fetch(apiUrl(`${endpoint}${id}/`), { method: "PATCH", credentials: apiCredentials, headers, body: formData });
    const payload = await parseApiResponse(response, "The backend returned an unexpected response.");
    if (!response.ok) throw new Error(payload.error || `Save failed. HTTP status: ${response.status}.`);
    setItems((current) => current.map((item) => (item.id === id ? makePayload(payload) : item)));
    toast({ title: "Saved", description: success, variant: "default" });
  };

  const deleteItem = async (id) => {
    try {
      const headers = await csrfHeaders();
      const response = await fetch(apiUrl(`${endpoint}${id}/`), { method: "DELETE", credentials: apiCredentials, headers });
      const payload = await parseApiResponse(response, "The backend returned an unexpected response.");
      if (!response.ok) throw new Error(payload.error || "Delete failed.");
      setItems((current) => current.filter((item) => item.id !== id));
      toast({ title: "Image deleted", description: "The image has been removed.", variant: "default" });
    } catch (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };

  const replaceItem = async (id, file) => {
    const error = validateFile(file);
    if (error) {
      toast({ title: "Replacement failed", description: error, variant: "destructive" });
      return;
    }
    try {
      const headers = await csrfHeaders();
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch(apiUrl(`${endpoint}${id}/`), { method: "PATCH", credentials: apiCredentials, headers, body: formData });
      const payload = await parseApiResponse(response, "The backend returned an unexpected response.");
      if (!response.ok) throw new Error(payload.error || "Replacement failed.");
      setItems((current) => current.map((item) => (item.id === id ? makePayload(payload) : item)));
      toast({ title: "Image replaced", description: "The new image has been saved.", variant: "default" });
    } catch (error) {
      toast({ title: "Replacement failed", description: error.message, variant: "destructive" });
    }
  };

  const reorder = async (fromIndex, direction) => {
    const nextIndex = fromIndex + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    const nextItems = [...items];
    [nextItems[fromIndex], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[fromIndex]];
    setItems(nextItems);
    try {
      const headers = await csrfHeaders();
      const formData = new FormData();
      nextItems.forEach((item) => formData.append("ids[]", item.id));
      const response = await fetch(apiUrl(reorderEndpoint), { method: "PATCH", credentials: apiCredentials, headers, body: formData });
      const payload = await parseApiResponse(response, "The backend returned an unexpected response.");
      if (!response.ok) throw new Error(payload.error || "Reorder failed.");
      setItems(payload.map(makePayload));
    } catch (error) {
      toast({ title: "Reorder failed", description: error.message, variant: "destructive" });
      loadItems();
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <CmsUploadPanel title={isHero ? "Upload hero image" : "Upload about image"} count={items.length} selectedFile={selectedFile} preview={preview} uploading={uploading} uploadProgress={uploadProgress} onFile={onFile} onUpload={upload} />
      <div className="space-y-4">
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950/95 p-5 text-slate-100">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-serif-display text-2xl">{isHero ? "Hero rotating banner" : "About / Vision images"}</h2>
              <p className="mt-1 text-sm text-slate-400">{isHero ? "Each image has its own overlay text, colors, buttons and position." : "Images rotate inside the existing left-side image container."}</p>
            </div>
            <button onClick={loadItems} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200"><RefreshCw className="mr-2 inline h-4 w-4" />Refresh</button>
          </div>
        </div>

        {loading ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-36 rounded-[1.5rem]" />) : items.map((item, index) => (
          <article key={item.id} className="glass-card gilded-edge overflow-hidden rounded-[1.5rem] border border-amber-100">
            <div className="grid gap-4 p-4 sm:grid-cols-[12rem_1fr]">
              <img src={item.image} alt={isHero ? item.heading_line_1 : "About section"} className="h-36 w-full rounded-[1.1rem] object-cover" />
              <div className="min-w-0 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif-display text-xl text-amber-900">{isHero ? item.heading_line_1 : `About Image ${index + 1}`}</h3>
                    <p className="mt-1 text-sm text-slate-600">Order {item.display_order} | Updated {formatDate(item.updated_at)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${item.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{item.is_active ? "Active" : "Disabled"}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isHero ? <button onClick={() => setEditorItem(item)} className="inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-white px-4 py-2 text-sm font-semibold text-amber-700"><Pencil className="h-4 w-4" />Edit</button> : null}
                  <button onClick={() => patchItem(item.id, { is_active: !item.is_active }, item.is_active ? "Image disabled." : "Image enabled.")} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">{item.is_active ? "Disable" : "Enable"}</button>
                  <label className="cursor-pointer rounded-full border border-amber-600/30 bg-white px-4 py-2 text-sm font-semibold text-amber-700">
                    Replace
                    <input type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={(event) => event.target.files?.[0] && replaceItem(item.id, event.target.files[0])} />
                  </label>
                  <button onClick={() => reorder(index, -1)} disabled={index === 0} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700 disabled:opacity-40"><ChevronUp className="h-4 w-4" /></button>
                  <button onClick={() => reorder(index, 1)} disabled={index === items.length - 1} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700 disabled:opacity-40"><ChevronDown className="h-4 w-4" /></button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"><Trash2 className="h-4 w-4" />Delete</button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this image?</AlertDialogTitle>
                        <AlertDialogDescription>This will remove it from this website section immediately.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteItem(item.id)} className="bg-rose-600 hover:bg-rose-700">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      {editorItem ? <HeroEditor item={editorItem} onClose={() => setEditorItem(null)} onSave={(draft) => patchItem(draft.id, draft)} /> : null}
    </div>
  );
}

function GalleryTab() {
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
      const response = await fetch(apiUrl("/api/gallery/"), { credentials: apiCredentials });
      const payload = await parseApiResponse(response, "Gallery load failed because the backend returned HTML instead of JSON.");
      if (!response.ok) throw new Error(payload.error || `Unable to load gallery images. HTTP status: ${response.status}.`);
      setImages(payload.map(makePayload));
    } catch (error) {
      toast({ title: "Gallery load failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const handleFileSelection = (event) => {
    const file = event.target.files?.[0];
    const error = validateFile(file);
    if (error) {
      toast({ title: "Unsupported file", description: error, variant: "destructive" });
      return;
    }
    preview && URL.revokeObjectURL(preview);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setFormState((current) => ({ ...current, title: file.name.replace(/\.[^/.]+$/, "") }));
  };

  const submitImage = async ({ method, endpoint, successTitle, successMessage, errorTitle, errorMessage }) => {
    const error = validateFile(selectedFile);
    if (error) {
      toast({ title: errorTitle, description: errorMessage, variant: "destructive" });
      return;
    }
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("section", formState.section);
    formData.append("title", formState.title || selectedFile.name.replace(/\.[^/.]+$/, ""));
    setUploading(true);
    setUploadProgress(0);
    let headers = {};
    try {
      headers = await csrfHeaders();
    } catch (csrfError) {
      toast({ title: errorTitle, description: csrfError.message, variant: "destructive" });
      setUploading(false);
      throw csrfError;
    }
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const requestUrl = apiUrl(endpoint);
      xhr.open(method, requestUrl);
      xhr.withCredentials = apiCredentials === "include";
      Object.entries(headers).forEach(([header, value]) => xhr.setRequestHeader(header, value));
      xhr.upload.addEventListener("progress", (event) => event.lengthComputable && setUploadProgress(Math.round((event.loaded / event.total) * 100)));
      xhr.onload = () => {
        try {
          const payload = xhr.responseText ? JSON.parse(xhr.responseText) : {};
          if (xhr.status >= 200 && xhr.status < 300) {
            toast({ title: successTitle, description: successMessage, variant: "default" });
            resolve(makePayload(payload));
          } else {
            toast({ title: errorTitle, description: payload.error || errorMessage, variant: "destructive" });
            reject(new Error(payload.error || errorMessage));
          }
        } catch {
          const message = `The gallery backend returned an unexpected response. URL: ${requestUrl}. HTTP status: ${xhr.status}.`;
          toast({ title: errorTitle, description: message, variant: "destructive" });
          reject(new Error(message));
        } finally {
          setUploading(false);
        }
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
      const payload = await submitImage({ method: "POST", endpoint: "/api/gallery/", successTitle: "Image uploaded", successMessage: "The gallery image is now live.", errorTitle: "Upload failed", errorMessage: "The image could not be uploaded." });
      setImages((current) => [payload, ...current]);
      setSelectedFile(null);
      preview && URL.revokeObjectURL(preview);
      setPreview(null);
      setFormState({ section: "Events", title: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const replaceImage = async (imageId) => {
    try {
      const payload = await submitImage({ method: "PUT", endpoint: `/api/gallery/${imageId}/`, successTitle: "Image replaced", successMessage: "The replacement image has been saved.", errorTitle: "Replacement failed", errorMessage: "The replacement image could not be saved." });
      setImages((current) => current.map((item) => (item.id === imageId ? payload : item)));
      setSelectedFile(null);
      preview && URL.revokeObjectURL(preview);
      setPreview(null);
      setFormState({ section: "Events", title: "" });
      setReplaceTargetId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteImage = async (imageId) => {
    try {
      const headers = await csrfHeaders();
      const response = await fetch(apiUrl(`/api/gallery/${imageId}/`), { method: "DELETE", credentials: apiCredentials, headers });
      const payload = await parseApiResponse(response, "Delete failed because the backend returned HTML instead of JSON.");
      if (!response.ok) throw new Error(payload.error || `Delete failed. HTTP status: ${response.status}.`);
      setImages((current) => current.filter((item) => item.id !== imageId));
      toast({ title: "Image removed", description: "The gallery image has been deleted.", variant: "default" });
    } catch (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-[1.5rem] border border-amber-100 bg-white/70 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif-display text-2xl text-amber-900">Upload or replace</h2>
            <p className="mt-1 text-sm text-slate-600">Existing gallery management remains unchanged.</p>
          </div>
          <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">{images.length} images</div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <TextInput label="Section" value={formState.section} onChange={(value) => setFormState({ ...formState, section: value })} />
          <TextInput label="Image title" value={formState.title} onChange={(value) => setFormState({ ...formState, title: value })} />
        </div>
        <CmsUploadPanel title="Gallery image" count={images.length} selectedFile={selectedFile} preview={preview} uploading={uploading} uploadProgress={uploadProgress} onFile={handleFileSelection} onUpload={uploadImage} maxCount={null} />
      </div>

      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950/95 p-4 text-slate-100 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-amber-500/20 p-2 text-amber-400"><CheckCircle2 className="h-5 w-5" /></div>
          <div>
            <h2 className="font-serif-display text-2xl">Image quality guardrails</h2>
            <p className="mt-1 text-sm text-slate-400">Every upload is constrained to preserve quality and fit the live site.</p>
          </div>
        </div>
        <div className="mt-6 space-y-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          <div className="flex items-start gap-3"><AlertCircle className="mt-0.5 h-4 w-4 text-amber-400" /> <span>Images use full width, full height, cover fit, centered.</span></div>
          <div className="flex items-start gap-3"><AlertCircle className="mt-0.5 h-4 w-4 text-amber-400" /> <span>Uploads stay in the Django media gallery folder.</span></div>
          <button onClick={fetchImages} className="mt-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200"><RefreshCw className="mr-2 inline h-4 w-4" />Refresh gallery</button>
        </div>
      </div>

      <div className="lg:col-span-2 grid gap-5 lg:grid-cols-2">
        {loading ? Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="glass-card rounded-[1.5rem] border border-amber-100 p-4"><Skeleton className="h-48 w-full rounded-[1.2rem]" /></div>
        )) : images.map((item) => (
          <motion.article key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card gilded-edge overflow-hidden rounded-[1.5rem] border border-amber-100">
            <div className="relative h-60 overflow-hidden bg-slate-900"><img src={item.image} alt={item.title} className="h-full w-full object-cover object-center" /></div>
            <div className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div><h3 className="font-serif-display text-xl text-amber-900">{item.title}</h3><p className="mt-1 text-sm text-slate-600">Section: {item.section}</p></div>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">{formatDate(item.created_at)}</span>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <AlertDialog open={replaceTargetId === item.id} onOpenChange={(open) => setReplaceTargetId(open ? item.id : null)}>
                  <AlertDialogTrigger asChild><button className="inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-white px-4 py-2 text-sm font-semibold text-amber-700"><RefreshCw className="h-4 w-4" />Replace Image</button></AlertDialogTrigger>
                  <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Replace this image?</AlertDialogTitle><AlertDialogDescription>Choose a new file above and confirm to swap the current gallery image.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => replaceImage(item.id)} className="bg-amber-600 hover:bg-amber-700">Replace</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild><button className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"><Trash2 className="h-4 w-4" />Delete Image</button></AlertDialogTrigger>
                  <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete this image?</AlertDialogTitle><AlertDialogDescription>This will remove it from the gallery and the public site immediately.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteImage(item.id)} className="bg-rose-600 hover:bg-rose-700">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export default function GalleryManagement() {
  const [activeTab, setActiveTab] = useState("hero");
  const heading = useMemo(() => TABS.find((tab) => tab.id === activeTab)?.label, [activeTab]);
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.18),_transparent_55%)] px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="glass-card gilded-edge overflow-hidden rounded-[2rem] border border-gold/20 p-6 shadow-2xl sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-600">Admin Module</p>
              <h1 className="mt-2 font-serif-display text-3xl text-amber-900 sm:text-4xl">Gallery Management</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">Manage hero rotating banners, the about-section image rotation, and the existing public gallery from one professional workspace.</p>
            </div>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">{heading}</span>
          </div>
          <div className="mt-8 grid gap-3 rounded-[1.25rem] border border-amber-100 bg-white/70 p-2 sm:grid-cols-3">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`rounded-[1rem] px-4 py-3 text-sm font-semibold transition ${activeTab === tab.id ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20" : "text-slate-700 hover:bg-amber-50"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {activeTab === "hero" ? <ManagedSection type="hero" /> : null}
        {activeTab === "about" ? <ManagedSection type="about" /> : null}
        {activeTab === "gallery" ? <GalleryTab /> : null}
      </div>
    </div>
  );
}
