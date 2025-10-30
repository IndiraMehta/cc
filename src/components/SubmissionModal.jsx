import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const SubmissionModal = ({ participation, onClose }) => {
  const [formData, setFormData] = useState({
    github_link: '',
    demo_link: '',
    description: '',
    ppt_file: null
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setFormData(prev => ({ ...prev, ppt_file: file }));
  };

  const uploadFile = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${participation.id}_${Date.now()}.${fileExt}`;
    const filePath = `submissions/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('event-files')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('event-files')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploading(true);

    try {
      let pptUrl = null;

      if (formData.ppt_file) {
        pptUrl = await uploadFile(formData.ppt_file);
      }

      const { error } = await supabase
        .from('submissions')
        .insert([{
          event_id: participation.events.id,
          team_id: participation.id,
          github_link: formData.github_link,
          ppt_url: pptUrl,
          demo_link: formData.demo_link || null,
          description: formData.description
        }]);

      if (error) throw error;

      alert('Submission successful!');
      onClose();
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Submit Your Project</h2>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="font-medium text-blue-900">{participation.events.name}</p>
          <p className="text-sm text-blue-700">Team: {participation.team_name}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              GitHub Repository Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={formData.github_link}
              onChange={(e) => setFormData(prev => ({ ...prev, github_link: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://github.com/username/repo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Demo Video Link</label>
            <input
              type="url"
              value={formData.demo_link}
              onChange={(e) => setFormData(prev => ({ ...prev, demo_link: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Upload Presentation (PPT/PDF)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto mb-2 text-gray-400" size={32} />
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.ppt,.pptx"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
              >
                Click to upload
              </label>
              <p className="text-sm text-gray-500 mt-1">PDF or PPT (max 10MB)</p>
              {formData.ppt_file && (
                <p className="text-sm text-green-600 mt-2">
                  Selected: {formData.ppt_file.name}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Project Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="6"
              placeholder="Describe your project, technologies used, and key features..."
              required
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              {loading ? (uploading ? 'Uploading...' : 'Submitting...') : 'Submit Project'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition font-medium disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
