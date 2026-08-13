import React, { useState, useEffect } from 'react';
import { 
  useGetProviderProfileQuery, 
  useUpdateProviderProfileMutation 
} from '../providerApiSlice';
import { useGetPublicCategoriesQuery } from '../../public/publicApiSlice';
import { Plus, X, Briefcase, Loader2, Save, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PostSkillPage() {
  const { data, isLoading } = useGetProviderProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProviderProfileMutation();
  const { data: catData, isLoading: isLoadingCats } = useGetPublicCategoriesQuery();
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  // data usually returns the provider document directly or inside a wrapper.
  const provider = data?.provider || data;

  useEffect(() => {
    if (provider?.skills) {
      setSkills(provider.skills);
    }
    if (provider?.categories) {
      // categories could be populated objects or IDs, extracting IDs:
      const catIds = provider.categories.map((c: any) => typeof c === 'string' ? c : c._id);
      setSelectedCategories(catIds);
    }
  }, [provider]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    
    if (skills.map(s => s.toLowerCase()).includes(newSkill.trim().toLowerCase())) {
      toast.error('You already added this skill!');
      return;
    }

    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = async () => {
    try {
      await updateProfile({ skills, categories: selectedCategories }).unwrap();
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update skills');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Briefcase className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Post a Skill</h1>
              <p className="text-gray-500 mt-1">Manage and highlight the services you offer to clients.</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleAddSkill} className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Add a new skill
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g., Plumber, React Developer, Yoga Instructor"
                className="flex-1 rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-gray-50"
              />
              <button
                type="submit"
                disabled={!newSkill.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            </div>
          </form>

          <div className="mb-10">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              Your Current Skills
              <span className="bg-blue-100 text-blue-800 text-xs py-0.5 px-2 rounded-full">
                {skills.length}
              </span>
            </h3>
            
            {skills.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500">You haven't added any skills yet.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2 bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-xl shadow-sm group hover:border-blue-300 transition-colors"
                  >
                    <span className="font-medium">{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      type="button"
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                      title="Remove skill"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-10 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Manage Categories
            </h3>
            
            {isLoadingCats ? (
              <div className="text-gray-500 text-sm">Loading categories...</div>
            ) : (
              <div className="space-y-4">
                <select
                  multiple
                  value={selectedCategories}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setSelectedCategories(selected);
                  }}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-gray-50 min-h-[120px]"
                >
                  {catData?.categories?.map((cat: any) => (
                    <option key={cat._id} value={cat._id} className="p-1.5 hover:bg-blue-50 cursor-pointer">
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple categories.</p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {isUpdating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
