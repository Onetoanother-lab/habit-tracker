// src/components/hooks/useProgressPhotos.js
import { useLocalStorage } from './useLocalStorage';

export const useProgressPhotos = () => {
  const [photos, setPhotos] = useLocalStorage('progress-photos', {});
  const [photoAlbums, setPhotoAlbums] = useLocalStorage('photo-albums', []);

  const addPhoto = (habitId, photoData) => {
    const photo = {
      id: Date.now().toString(),
      habitId,
      dataUrl: photoData.dataUrl,
      caption: photoData.caption || '',
      tags: photoData.tags || [],
      timestamp: Date.now(),
      date: new Date().toISOString(),
      metadata: {
        size: photoData.size || null,
        type: photoData.type || 'image/jpeg'
      }
    };

    setPhotos(prev => ({
      ...prev,
      [photo.id]: photo
    }));

    return photo;
  };

  const deletePhoto = (photoId) => {
    setPhotos(prev => {
      const updated = { ...prev };
      delete updated[photoId];
      return updated;
    });
  };

  const updatePhotoCaption = (photoId, caption) => {
    setPhotos(prev => ({
      ...prev,
      [photoId]: {
        ...prev[photoId],
        caption,
        updatedAt: Date.now()
      }
    }));
  };

  const updatePhotoTags = (photoId, tags) => {
    setPhotos(prev => ({
      ...prev,
      [photoId]: {
        ...prev[photoId],
        tags,
        updatedAt: Date.now()
      }
    }));
  };

  const getPhotosForHabit = (habitId, limit = null) => {
    const habitPhotos = Object.values(photos)
      .filter(p => p.habitId === habitId)
      .sort((a, b) => b.timestamp - a.timestamp);
    
    return limit ? habitPhotos.slice(0, limit) : habitPhotos;
  };

  const getAllPhotos = (sortBy = 'date') => {
    const allPhotos = Object.values(photos);
    
    if (sortBy === 'date') {
      return allPhotos.sort((a, b) => b.timestamp - a.timestamp);
    }
    
    return allPhotos;
  };

  const createAlbum = (albumData) => {
    const album = {
      id: Date.now().toString(),
      name: albumData.name,
      description: albumData.description || '',
      photoIds: albumData.photoIds || [],
      createdAt: Date.now(),
      coverPhotoId: albumData.coverPhotoId || null
    };

    setPhotoAlbums(prev => [...prev, album]);
    return album;
  };

  const addPhotoToAlbum = (albumId, photoId) => {
    setPhotoAlbums(prev => prev.map(album => 
      album.id === albumId
        ? { ...album, photoIds: [...new Set([...album.photoIds, photoId])] }
        : album
    ));
  };

  const removePhotoFromAlbum = (albumId, photoId) => {
    setPhotoAlbums(prev => prev.map(album => 
      album.id === albumId
        ? { ...album, photoIds: album.photoIds.filter(id => id !== photoId) }
        : album
    ));
  };

  const deleteAlbum = (albumId) => {
    setPhotoAlbums(prev => prev.filter(a => a.id !== albumId));
  };

  const getAlbumPhotos = (albumId) => {
    const album = photoAlbums.find(a => a.id === albumId);
    if (!album) return [];
    
    return album.photoIds
      .map(id => photos[id])
      .filter(Boolean);
  };

  const getPhotoTimeline = (habitId = null) => {
    const relevantPhotos = habitId 
      ? getPhotosForHabit(habitId)
      : getAllPhotos();

    // Group by month
    const timeline = {};
    
    relevantPhotos.forEach(photo => {
      const date = new Date(photo.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!timeline[monthKey]) {
        timeline[monthKey] = [];
      }
      timeline[monthKey].push(photo);
    });

    return timeline;
  };

  const getStats = () => {
    const allPhotos = Object.values(photos);
    const totalSize = allPhotos.reduce((sum, p) => sum + (p.metadata.size || 0), 0);
    const habitsWithPhotos = new Set(allPhotos.map(p => p.habitId)).size;

    return {
      totalPhotos: allPhotos.length,
      totalAlbums: photoAlbums.length,
      totalSize,
      habitsWithPhotos,
      oldestPhoto: allPhotos.length > 0 
        ? allPhotos.sort((a, b) => a.timestamp - b.timestamp)[0]
        : null,
      newestPhoto: allPhotos.length > 0
        ? allPhotos.sort((a, b) => b.timestamp - a.timestamp)[0]
        : null
    };
  };

  return {
    photos: Object.values(photos),
    photoAlbums,
    addPhoto,
    deletePhoto,
    updatePhotoCaption,
    updatePhotoTags,
    getPhotosForHabit,
    getAllPhotos,
    createAlbum,
    addPhotoToAlbum,
    removePhotoFromAlbum,
    deleteAlbum,
    getAlbumPhotos,
    getPhotoTimeline,
    getStats
  };
};