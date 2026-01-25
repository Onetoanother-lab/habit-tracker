// src/components/features/ProgressPhotos.jsx
import { useState } from 'react';
import { Camera, Plus, X, Edit, Trash2, Image as ImageIcon, Calendar, Tag } from 'lucide-react';
import { useProgressPhotos } from '../hooks/useProgressPhotos';

export default function ProgressPhotos({ habitId, habitName, isDark }) {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'timeline'

  const {
    addPhoto,
    deletePhoto,
    updatePhotoCaption,
    getPhotosForHabit,
    getPhotoTimeline,
    getStats
  } = useProgressPhotos();

  const photos = getPhotosForHabit(habitId);
  const timeline = getPhotoTimeline(habitId);
  const stats = getStats();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      addPhoto(habitId, {
        dataUrl: event.target.result,
        caption,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        size: file.size,
        type: file.type
      });
      
      setCaption('');
      setTags('');
      setShowUpload(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = (photoId) => {
    if (confirm('Delete this photo?')) {
      deletePhoto(photoId);
      setSelectedPhoto(null);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`p-6 rounded-2xl border ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Camera className="text-purple-500" size={24} />
          <div>
            <h3 className="font-bold text-lg">Progress Photos</h3>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {habitName || 'Visual progress tracking'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'timeline' : 'grid')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
              isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {viewMode === 'grid' ? <Calendar size={16} /> : <ImageIcon size={16} />}
          </button>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="p-2 rounded-lg bg-linear-to-r from-purple-500 to-pink-500 text-white hover:scale-110 transition-all"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={`grid grid-cols-3 gap-3 p-3 rounded-xl mb-4 ${
        isDark ? 'bg-white/5' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="text-xl font-black text-purple-500">{photos.length}</div>
          <div className="text-xs text-gray-500">Photos</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-black text-blue-500">
            {stats.habitsWithPhotos}
          </div>
          <div className="text-xs text-gray-500">Habits</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-black text-green-500">
            {Math.round(stats.totalSize / 1024)}KB
          </div>
          <div className="text-xs text-gray-500">Storage</div>
        </div>
      </div>

      {/* Upload Form */}
      {showUpload && (
        <div className={`p-4 rounded-xl border mb-4 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
        }`}>
          <label className={`block p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all hover:scale-105 mb-3 ${
            isDark ? 'border-white/20 hover:border-purple-500' : 'border-gray-300 hover:border-purple-500'
          }`}>
            <Camera className="mx-auto mb-2 text-purple-500" size={32} />
            <div className="text-sm font-semibold mb-1">Upload Progress Photo</div>
            <div className="text-xs text-gray-500">Max 5MB • JPG, PNG, GIF</div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <input
            type="text"
            placeholder="Caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg mb-2 ${
              isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
            }`}
          />

          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg ${
              isDark ? 'bg-white/10 border border-white/20' : 'border border-gray-300'
            }`}
          />
        </div>
      )}

      {/* Photos Display */}
      {photos.length === 0 ? (
        <div className="text-center py-12">
          <Camera size={48} className="mx-auto mb-3 text-gray-400 opacity-50" />
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            No progress photos yet. Upload your first photo to track your journey!
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photos.map(photo => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group transition-all hover:scale-105 ${
                isDark ? 'border border-white/10' : 'border border-gray-200'
              }`}
            >
              <img
                src={photo.dataUrl}
                alt={photo.caption || 'Progress photo'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-white text-center p-2">
                  <div className="text-xs font-semibold mb-1">
                    {formatDate(photo.timestamp)}
                  </div>
                  {photo.caption && (
                    <div className="text-xs opacity-80 line-clamp-2">
                      {photo.caption}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(timeline).map(([monthKey, monthPhotos]) => {
            const [year, month] = monthKey.split('-');
            const monthName = new Date(year, parseInt(month) - 1).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            });

            return (
              <div key={monthKey}>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-purple-500" />
                  {monthName}
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    ({monthPhotos.length} photos)
                  </span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {monthPhotos.map(photo => (
                    <div
                      key={photo.id}
                      onClick={() => setSelectedPhoto(photo)}
                      className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 ${
                        isDark ? 'border border-white/10' : 'border border-gray-200'
                      }`}
                    >
                      <img
                        src={photo.dataUrl}
                        alt={photo.caption || 'Progress photo'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`max-w-4xl w-full rounded-2xl overflow-hidden ${
            isDark ? 'bg-gray-900 border border-white/10' : 'bg-white'
          }`}>
            <div className={`p-4 border-b flex items-center justify-between ${
              isDark ? 'border-white/10' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                <span className="text-sm font-semibold">
                  {formatDate(selectedPhoto.timestamp)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeletePhoto(selectedPhoto.id)}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <img
                src={selectedPhoto.dataUrl}
                alt={selectedPhoto.caption || 'Progress photo'}
                className="w-full rounded-xl mb-4"
              />

              {selectedPhoto.caption && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 text-sm font-semibold mb-1">
                    <Edit size={14} />
                    Caption
                  </div>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    {selectedPhoto.caption}
                  </p>
                </div>
              )}

              {selectedPhoto.tags && selectedPhoto.tags.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <Tag size={14} />
                    Tags
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedPhoto.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}