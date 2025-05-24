import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { User } from '../types/user';
import userService from '../services/userService';
import fileService from '../services/fileService';
import config from '../config';

interface ProfileEditModalProps {
  user: User;
  onClose: () => void;
  onUserUpdated: (updatedUser: User) => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #1e1e1e;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #fff;
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #aaa;
  font-size: 1.5rem;
  cursor: pointer;
  
  &:hover {
    color: #fff;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #fff;
  font-size: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #333;
  background-color: #2a2a2a;
  color: #fff;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #1db954;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #333;
  background-color: #2a2a2a;
  color: #fff;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #1db954;
  }
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AvatarPreview = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  background-color: #333;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #444;
  }
`;

const SubmitButton = styled.button`
  background-color: #1db954;
  color: #fff;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background-color: #1ed760;
  }
  
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 1rem;
`;

const formatAvatarUrl = (url: string | null | undefined, isObjectUrl = false): string => {
  if (!url) return 'https://via.placeholder.com/80';
  if (isObjectUrl) return url; // Return object URLs as-is for previews
  return url.startsWith('http') ? url : `${config.MEDIA_URL}/${url}`;
};

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ user, onClose, onUserUpdated }) => {
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Cleanup any object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAvatarFile(files[0]);
      
      // Clean up previous preview URL if it exists
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      
      // Create a new preview URL
      const newPreviewUrl = URL.createObjectURL(files[0]);
      setPreviewUrl(newPreviewUrl);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      let updatedAvatarUrl = avatarUrl;
      
      // If there's a new avatar file, upload it first
      if (avatarFile) {
        updatedAvatarUrl = await fileService.uploadImage(avatarFile);
        setAvatarUrl(updatedAvatarUrl); // Update the state with new URL
      }
      
      // Now update the user profile with the new data
      const updatedUserData = {
        name,
        bio,
        avatarUrl: updatedAvatarUrl
      };
      
      const updatedUser = await userService.updateUser(user.id, updatedUserData);
      
      // Notify parent component of the update
      onUserUpdated(updatedUser);
      
      // Close the modal
      onClose();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Не удалось обновить профиль. Пожалуйста, попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Use preview URL if available, otherwise use avatar URL
  const displayAvatarUrl = previewUrl || formatAvatarUrl(avatarUrl);
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Редактировать профиль</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Фото профиля</Label>
            <AvatarSection>
              <AvatarPreview 
                src={displayAvatarUrl} 
                alt={name}
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80';
                }}
              />
              <UploadButton type="button" onClick={handleAvatarClick}>
                Изменить фото
              </UploadButton>
              <FileInput 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </AvatarSection>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="name">Имя пользователя</Label>
            <Input 
              id="name" 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="bio">О себе</Label>
            <TextArea 
              id="bio" 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
          </SubmitButton>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ProfileEditModal; 