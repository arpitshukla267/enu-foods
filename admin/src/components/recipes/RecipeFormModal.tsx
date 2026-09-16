import React, { useEffect, useState } from "react";
import { X, Check, Image as ImageIcon, UploadCloud, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Recipe, RecipeDifficulty, RecipeStatus } from "../../types";
import { uploadProductImage } from "../../lib/uploadApi";
import {
  RecipeSpiceSelector,
  SpiceEntry,
  spiceEntriesFromNames,
  spiceNamesFromEntries,
} from "./RecipeSpiceSelector";
import {
  DynamicTextListField,
  normalizeTextList,
  textListFromArray,
} from "./DynamicTextListField";

interface RecipeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Recipe, "id" | "createdAt" | "updatedAt">) => void;
  recipeToEdit?: Recipe | null;
}

export const RecipeFormModal: React.FC<RecipeFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  recipeToEdit,
}) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [difficulty, setDifficulty] = useState<RecipeDifficulty>("Easy");
  const [servings, setServings] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [spiceEntries, setSpiceEntries] = useState<SpiceEntry[]>([{ rowId: "spice-0", productName: "" }]);
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [status, setStatus] = useState<RecipeStatus>("active");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (recipeToEdit) {
      setTitle(recipeToEdit.title);
      setSubtitle(recipeToEdit.subtitle);
      setSlug(recipeToEdit.slug);
      setPrepTime(recipeToEdit.prepTime);
      setCookTime(recipeToEdit.cookTime);
      setDifficulty(recipeToEdit.difficulty);
      setServings(recipeToEdit.servings);
      setImage(recipeToEdit.image);
      setDescription(recipeToEdit.description);
      setSpiceEntries(spiceEntriesFromNames(recipeToEdit.enuSpicesUsed));
      setIngredients(textListFromArray(recipeToEdit.ingredientsList));
      setInstructions(textListFromArray(recipeToEdit.instructions));
      setStatus(recipeToEdit.status);
    } else {
      setTitle("");
      setSubtitle("");
      setSlug("");
      setPrepTime("");
      setCookTime("");
      setDifficulty("Easy");
      setServings("");
      setImage("");
      setDescription("");
      setSpiceEntries(spiceEntriesFromNames([]));
      setIngredients([""]);
      setInstructions([""]);
      setStatus("active");
    }
    setErrors({});
    setUploadError(null);
    setIsUploadingImage(false);
  }, [recipeToEdit, isOpen]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!recipeToEdit) {
      setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setUploadError(null);

    try {
      const uploaded = await uploadProductImage(file);
      setImage(uploaded.url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!image.trim()) newErrors.image = "Recipe image is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      title: title.trim(),
      subtitle: subtitle.trim(),
      slug: slug.trim(),
      prepTime: prepTime.trim(),
      cookTime: cookTime.trim(),
      difficulty,
      servings: servings.trim(),
      image: image.trim(),
      description: description.trim(),
      enuSpicesUsed: spiceNamesFromEntries(spiceEntries),
      ingredientsList: normalizeTextList(ingredients),
      instructions: normalizeTextList(instructions),
      status,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#E8E2D5] shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-[#173D2A] text-white flex items-center justify-between border-b border-[#245A3F] shrink-0">
              <div>
                <h3 className="text-base font-bold font-serif-brand text-[#F9F7F2]">
                  {recipeToEdit ? "Edit Recipe" : "Add New Recipe"}
                </h3>
                <p className="text-xs text-[#A6C5B3]">
                  Recipe details shown on the storefront recipes page.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm bg-white border border-[#DCD4C0] rounded-xl focus:outline-none focus:border-[#173D2A]"
                  />
                  {errors.title && (
                    <p className="text-xs text-[#9E382B] mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm bg-white border border-[#DCD4C0] rounded-xl focus:outline-none focus:border-[#173D2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs font-mono bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl focus:outline-none focus:border-[#173D2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                    Prep Time
                  </label>
                  <input
                    type="text"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="e.g. 15 mins"
                    className="w-full mt-1 px-3 py-2 text-sm bg-white border border-[#DCD4C0] rounded-xl focus:outline-none focus:border-[#173D2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                    Cook Time
                  </label>
                  <input
                    type="text"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    placeholder="e.g. 30 mins"
                    className="w-full mt-1 px-3 py-2 text-sm bg-white border border-[#DCD4C0] rounded-xl focus:outline-none focus:border-[#173D2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as RecipeDifficulty)}
                    className="w-full mt-1 px-3 py-2 text-sm bg-white border border-[#DCD4C0] rounded-xl focus:outline-none focus:border-[#173D2A]"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                    Servings
                  </label>
                  <input
                    type="text"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    placeholder="e.g. Serves 4"
                    className="w-full mt-1 px-3 py-2 text-sm bg-white border border-[#DCD4C0] rounded-xl focus:outline-none focus:border-[#173D2A]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide mb-2">
                    Recipe Image *
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-32 h-32 rounded-2xl bg-[#F9F7F2] border border-[#DCD4C0] overflow-hidden flex items-center justify-center shrink-0">
                      {image ? (
                        <img src={image} alt="Recipe preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-[#8F816B]" />
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <label className="block text-xs font-semibold text-[#5C5343]">
                        Image URL or upload from computer
                      </label>
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#DCD4C0] rounded-xl focus:outline-none focus:border-[#173D2A]"
                      />
                      <label className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#173D2A] bg-[#F4EFE6] border border-[#DCD4C0] rounded-xl cursor-pointer hover:bg-[#EAE2D2] transition-colors">
                        {isUploadingImage ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <UploadCloud className="w-4 h-4" />
                        )}
                        {isUploadingImage ? "Uploading..." : "Upload from computer"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={isUploadingImage}
                        />
                      </label>
                      {errors.image && (
                        <p className="text-xs text-[#9E382B]">{errors.image}</p>
                      )}
                      {uploadError && <p className="text-xs text-[#9E382B]">{uploadError}</p>}
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm bg-white border border-[#DCD4C0] rounded-xl focus:outline-none focus:border-[#173D2A]"
                  />
                  {errors.description && (
                    <p className="text-xs text-[#9E382B] mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <RecipeSpiceSelector entries={spiceEntries} onChange={setSpiceEntries} />
                </div>

                <div className="sm:col-span-2">
                  <DynamicTextListField
                    label="Ingredients"
                    hint="Add each ingredient as a separate line item."
                    items={ingredients}
                    onChange={setIngredients}
                    placeholder="e.g. 2 cups basmati rice"
                    addLabel="Add Ingredient"
                  />
                </div>

                <div className="sm:col-span-2">
                  <DynamicTextListField
                    label="Instructions"
                    hint="Add each cooking step in order."
                    items={instructions}
                    onChange={setInstructions}
                    placeholder="Describe this step..."
                    multiline
                    addLabel="Add Step"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as RecipeStatus)}
                    className="w-full mt-1 px-3 py-2 text-sm bg-white border border-[#DCD4C0] rounded-xl focus:outline-none focus:border-[#173D2A]"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E2D5]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-[#736854] hover:bg-[#F4EFE6] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingImage}
                  className="px-4 py-2 text-xs font-bold text-[#173D2A] bg-[#D99B26] hover:bg-[#C68A1B] disabled:opacity-60 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  {recipeToEdit ? "Save Changes" : "Create Recipe"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
