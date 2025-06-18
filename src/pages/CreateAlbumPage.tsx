import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import fileService from '../services/fileService';
import albumService from '../services/albumService';
import trackService from '../services/trackService';
import authService from '../services/authService';

// Стилизованные компоненты
const PageContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  color: #fff;
`;

const PageTitle = styled.h1`
  font-size: 2.2rem;
  margin-bottom: 2rem;
  color: #fff;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 1.5rem;
`;

const Section = styled.div`
  background: linear-gradient(90deg, rgba(32, 32, 32, 0.8) 0%, rgba(42, 42, 42, 0.8) 100%);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 20px;
    background: #1db954;
    border-radius: 2px;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  font-size: 1.1rem;
  color: #b3b3b3;
`;

const Input = styled.input`
  background: rgba(24, 24, 24, 0.8);
  border: 1px solid #333;
  border-radius: 8px;
  padding: 0.8rem 1rem;
  color: white;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #1db954;
    box-shadow: 0 0 0 2px rgba(29, 185, 84, 0.3);
  }
`;

const FileInput = styled.div`
  position: relative;
  overflow: hidden;
  display: inline-block;
  margin-top: 0.5rem;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  background: rgba(24, 24, 24, 0.8);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  border: 1px solid #333;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(40, 40, 40, 0.8);
  }
`;

const HiddenFileInput = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 0.1px;
  height: 0.1px;
`;

const FileName = styled.span`
  margin-left: 1rem;
  color: #b3b3b3;
`;

const ImagePreview = styled.div<{ $hasImage: boolean }>`
  width: 200px;
  height: 200px;
  background: ${props => props.$hasImage ? 'transparent' : 'rgba(24, 24, 24, 0.8)'};
  border-radius: 8px;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b3b3b3;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Button = styled.button`
  background: #1db954;
  color: white;
  border: none;
  border-radius: 8px;
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #1ed760;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const TrackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TrackItem = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 1fr auto;
  gap: 1rem;
  align-items: center;
  background: rgba(20, 20, 20, 0.5);
  padding: 1rem;
  border-radius: 8px;
  
  @media (max-width: 600px) {
    grid-template-columns: 40px 1fr;
    grid-template-rows: auto auto;
    gap: 0.5rem;
  }
`;

const TrackNumber = styled.div`
  width: 30px;
  height: 30px;
  background: rgba(29, 185, 84, 0.3);
  color: #1db954;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const RemoveButton = styled.button`
  background: rgba(255, 60, 60, 0.7);
  color: white;
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 60, 60, 0.9);
  }
`;

const SubmitButton = styled(Button)`
  padding: 1rem 2rem;
  font-size: 1.1rem;
  margin-top: 1rem;
  background: linear-gradient(90deg, #1db954 0%, #1ed760 100%);
  box-shadow: 0 4px 12px rgba(29, 185, 84, 0.4);
`;

const ErrorMessage = styled.div`
  color: #ff5555;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

interface AlbumTrack {
  name: string;
  file: File | null;
  duration: number;
}

const CreateAlbumPage: React.FC = () => {
  const navigate = useNavigate();
  const [albumName, setAlbumName] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const [tracks, setTracks] = useState<AlbumTrack[]>([{ name: '', file: null, duration: 0 }]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleAlbumNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbumName(e.target.value);
    if (errors.albumName) {
      const newErrors = { ...errors };
      delete newErrors.albumName;
      setErrors(newErrors);
    }
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const resizedFile = await resizeImage(file, 200, 200);
      setCoverImage(resizedFile);
      setCoverImagePreview(URL.createObjectURL(resizedFile));
      
      if (errors.coverImage) {
        const newErrors = { ...errors };
        delete newErrors.coverImage;
        setErrors(newErrors);
      }
    }
  };

  const handleTrackNameChange = (index: number, value: string) => {
    const newTracks = [...tracks];
    newTracks[index].name = value;
    setTracks(newTracks);
    
    if (errors[`track_${index}_name`]) {
      const newErrors = { ...errors };
      delete newErrors[`track_${index}_name`];
      setErrors(newErrors);
    }
  };

  const handleTrackFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newTracks = [...tracks];
      newTracks[index].file = file;
      
      // Определение длительности аудиофайла
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        newTracks[index].duration = Math.round(audio.duration);
        setTracks([...newTracks]);
      });
      
      setTracks(newTracks);
      
      if (errors[`track_${index}_file`]) {
        const newErrors = { ...errors };
        delete newErrors[`track_${index}_file`];
        setErrors(newErrors);
      }
    }
  };

  const addTrack = () => {
    setTracks([...tracks, { name: '', file: null, duration: 0 }]);
  };

  const removeTrack = (index: number) => {
    if (tracks.length > 1) {
      const newTracks = [...tracks];
      newTracks.splice(index, 1);
      setTracks(newTracks);
      
      // Удаляем ошибки для этого трека
      const newErrors = { ...errors };
      delete newErrors[`track_${index}_name`];
      delete newErrors[`track_${index}_file`];
      setErrors(newErrors);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!albumName.trim()) {
      newErrors.albumName = 'Введите название альбома';
    }
    
    if (!coverImage) {
      newErrors.coverImage = 'Загрузите обложку альбома';
    }
    
    tracks.forEach((track, index) => {
      if (!track.name.trim()) {
        newErrors[`track_${index}_name`] = 'Введите название трека';
      }
      
      if (!track.file) {
        newErrors[`track_${index}_file`] = 'Загрузите файл трека';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // 1. Загружаем обложку альбома
      const coverImageUrl = coverImage ? await fileService.uploadImage(coverImage) : '';
      if (!coverImageUrl) {
        throw new Error('Не удалось загрузить обложку альбома');
      }
      
      // 2. Создаём альбом
      const userId = authService.getUserId();
      if (!userId) {
        throw new Error('Пользователь не авторизован');
      }
      
      const createdAlbum = await albumService.createAlbum({
        title: albumName,
        avatarUrl: coverImageUrl,
        authorId: userId
      });
      
      console.log('Album created:', createdAlbum);
      
      // 3. Для каждого трека: создать метаданные и загрузить аудиофайл
      for (const track of tracks) {
        if (track.name && track.file) {
          // 3.1. Создаём метаданные трека
          const createdTrack = await trackService.createTrack({
            title: track.name,
            albumId: createdAlbum.id,
            duration: track.duration,
            avatarUrl: coverImageUrl // Используем ту же обложку для треков
          });
          
          // 3.2. Загружаем аудиофайл трека
          await fileService.uploadTrack(track.file, createdTrack.id);
        }
      }
      
      // 4. Перенаправляем на страницу альбома
      navigate(`/album/${createdAlbum.id}`);
    } catch (error) {
      console.error('Error creating album:', error);
      setErrors({ 
        submit: error instanceof Error ? error.message : 'Произошла ошибка при создании альбома' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageTitle>Создание нового альбома</PageTitle>
      
      <FormContainer onSubmit={handleSubmit}>
        {errors.submit && (
          <ErrorMessage style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255, 0, 0, 0.1)' }}>
            {errors.submit}
          </ErrorMessage>
        )}
        <Section>
          <SectionTitle>Информация об альбоме</SectionTitle>
          
          <InputGroup>
            <Label htmlFor="albumName">Название альбома</Label>
            <Input 
              id="albumName" 
              type="text" 
              value={albumName} 
              onChange={handleAlbumNameChange} 
              placeholder="Введите название альбома"
            />
            {errors.albumName && <ErrorMessage>{errors.albumName}</ErrorMessage>}
          </InputGroup>
          
          <InputGroup>
            <Label>Обложка альбома</Label>
            <FileInput>
              <FileInputLabel>
                Выбрать изображение
                <HiddenFileInput 
                  type="file" 
                  accept="image/*" 
                  onChange={handleCoverImageChange} 
                />
              </FileInputLabel>
            </FileInput>
            {errors.coverImage && <ErrorMessage>{errors.coverImage}</ErrorMessage>}
            
            <ImagePreview $hasImage={!!coverImagePreview}>
              {coverImagePreview ? (
                <img src={coverImagePreview} alt="Предпросмотр обложки" />
              ) : (
                'Предпросмотр обложки'
              )}
            </ImagePreview>
          </InputGroup>
        </Section>
        
        <Section>
          <SectionTitle>Треки альбома</SectionTitle>
          
          <TrackList>
            {tracks.map((track, index) => (
              <TrackItem key={index}>
                <TrackNumber>{index + 1}</TrackNumber>
                
                <div>
                  <Input 
                    id={`trackName_${index}`} 
                    type="text" 
                    value={track.name} 
                    onChange={(e) => handleTrackNameChange(index, e.target.value)} 
                    placeholder="Введите название трека"
                  />
                  {errors[`track_${index}_name`] && (
                    <ErrorMessage>{errors[`track_${index}_name`]}</ErrorMessage>
                  )}
                </div>
                
                <div>
                  <FileInput>
                    <FileInputLabel>
                      Выбрать файл
                      <HiddenFileInput 
                        type="file" 
                        accept="audio/*" 
                        onChange={(e) => handleTrackFileChange(index, e)} 
                      />
                    </FileInputLabel>
                    {track.file && <FileName>{track.file.name}</FileName>}
                  </FileInput>
                  {errors[`track_${index}_file`] && (
                    <ErrorMessage>{errors[`track_${index}_file`]}</ErrorMessage>
                  )}
                </div>
                
                <RemoveButton 
                  type="button" 
                  onClick={() => removeTrack(index)}
                  disabled={tracks.length === 1}
                >
                  ✕
                </RemoveButton>
              </TrackItem>
            ))}
          </TrackList>
          
          <Button type="button" onClick={addTrack}>
            + Добавить трек
          </Button>
        </Section>
        
        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? 'Создание альбома...' : 'Создать альбом'}
        </SubmitButton>
      </FormContainer>
    </PageContainer>
  );
};

const resizeImage = async (file: File, width: number, height: number): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        } else {
          resolve(file);  // Fallback if blob fails
        }
      }, 'image/jpeg');
    };
    img.src = URL.createObjectURL(file);
  });
};

export default CreateAlbumPage; 