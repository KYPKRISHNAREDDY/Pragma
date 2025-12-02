/**
 * Image Composer Service
 * Composites character photos onto background scenes using HTML5 Canvas
 */

import type { CharacterSlot } from '../types';

export interface CompositeRequest {
  backgroundUrl?: string;
  backgroundColor?: string;
  width: number;
  height: number;
  characterSlots: Array<{
    slot: CharacterSlot;
    photoUrl: string;
  }>;
}

/**
 * Load an image from URL
 */
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Create a circular mask for photos (makes photos appear as circles/ovals)
 */
const drawCircularImage = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number = 0
) => {
  ctx.save();

  // Move to center of where we want to draw
  ctx.translate(x + width / 2, y + height / 2);

  // Apply rotation if specified
  if (rotation) {
    ctx.rotate((rotation * Math.PI) / 180);
  }

  // Create circular/oval clip path
  ctx.beginPath();
  ctx.ellipse(0, 0, width / 2, height / 2, 0, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.clip();

  // Draw image
  ctx.drawImage(image, -width / 2, -height / 2, width, height);

  // Add a subtle border
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 0, width / 2, height / 2, 0, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.restore();
};

/**
 * Compose a complete story frame with background and character photos
 */
export const composeFrame = async (request: CompositeRequest): Promise<string> => {
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = request.width;
  canvas.height = request.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Draw background
  if (request.backgroundUrl) {
    try {
      const bgImage = await loadImage(request.backgroundUrl);
      ctx.drawImage(bgImage, 0, 0, request.width, request.height);
    } catch (error) {
      console.warn('Failed to load background image, using fallback color');
      ctx.fillStyle = request.backgroundColor || '#F3F4F6';
      ctx.fillRect(0, 0, request.width, request.height);
    }
  } else {
    // Solid color background
    ctx.fillStyle = request.backgroundColor || '#F3F4F6';
    ctx.fillRect(0, 0, request.width, request.height);
  }

  // Sort character slots by zIndex (lower first = background)
  const sortedSlots = [...request.characterSlots].sort(
    (a, b) => (a.slot.zIndex || 0) - (b.slot.zIndex || 0)
  );

  // Draw each character photo into its slot
  for (const { slot, photoUrl } of sortedSlots) {
    try {
      const photoImage = await loadImage(photoUrl);

      // Draw with circular mask
      drawCircularImage(
        ctx,
        photoImage,
        slot.position.x,
        slot.position.y,
        slot.size.width,
        slot.size.height,
        slot.rotation || 0
      );

      // Add role label below photo (optional, for demo visibility)
      ctx.save();
      ctx.fillStyle = '#1F2937';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        slot.role.charAt(0).toUpperCase() + slot.role.slice(1),
        slot.position.x + slot.size.width / 2,
        slot.position.y + slot.size.height + 20
      );
      ctx.restore();

    } catch (error) {
      console.warn(`Failed to load photo for ${slot.role}:`, error);

      // Draw placeholder circle
      ctx.save();
      ctx.fillStyle = '#E5E7EB';
      ctx.beginPath();
      ctx.ellipse(
        slot.position.x + slot.size.width / 2,
        slot.position.y + slot.size.height / 2,
        slot.size.width / 2,
        slot.size.height / 2,
        0,
        0,
        2 * Math.PI
      );
      ctx.fill();

      // Draw icon
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        '👤',
        slot.position.x + slot.size.width / 2,
        slot.position.y + slot.size.height / 2
      );
      ctx.restore();
    }
  }

  // Convert canvas to data URL
  return canvas.toDataURL('image/png');
};

/**
 * Generate a simple background scene using Canvas
 * (for demo - in production you'd use actual scene images)
 */
export const generateSceneBackground = (
  sceneType: string,
  width: number,
  height: number
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Scene-specific backgrounds
  switch (sceneType) {
    case 'barber_shop':
      // Floor
      ctx.fillStyle = '#8B7355';
      ctx.fillRect(0, height * 0.6, width, height * 0.4);

      // Wall
      ctx.fillStyle = '#E8D5C4';
      ctx.fillRect(0, 0, width, height * 0.6);

      // Mirror
      ctx.fillStyle = '#D1E7F0';
      ctx.fillRect(width * 0.1, height * 0.1, width * 0.3, height * 0.4);
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 5;
      ctx.strokeRect(width * 0.1, height * 0.1, width * 0.3, height * 0.4);

      // Barber chair (simple rectangle)
      ctx.fillStyle = '#4A4A4A';
      ctx.fillRect(width * 0.55, height * 0.5, width * 0.25, height * 0.15);

      // Chair back
      ctx.fillStyle = '#333333';
      ctx.fillRect(width * 0.55, height * 0.35, width * 0.25, height * 0.15);

      // Waiting bench
      ctx.fillStyle = '#8B6914';
      ctx.fillRect(width * 0.05, height * 0.7, width * 0.3, height * 0.1);
      break;

    case 'classroom':
      // Floor
      ctx.fillStyle = '#C9B896';
      ctx.fillRect(0, height * 0.65, width, height * 0.35);

      // Wall
      ctx.fillStyle = '#FEF3C7';
      ctx.fillRect(0, 0, width, height * 0.65);

      // Blackboard
      ctx.fillStyle = '#1F2937';
      ctx.fillRect(width * 0.2, height * 0.1, width * 0.6, height * 0.35);

      // Desks (simple rectangles)
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(width * 0.15, height * 0.6, width * 0.25, height * 0.15);
      ctx.fillRect(width * 0.6, height * 0.6, width * 0.25, height * 0.15);
      break;

    case 'bedroom':
      // Floor
      ctx.fillStyle = '#B8A898';
      ctx.fillRect(0, height * 0.6, width, height * 0.4);

      // Wall
      ctx.fillStyle = '#E0E7FF';
      ctx.fillRect(0, 0, width, height * 0.6);

      // Bed
      ctx.fillStyle = '#6366F1';
      ctx.fillRect(width * 0.15, height * 0.5, width * 0.4, height * 0.3);

      // Pillow
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(width * 0.18, height * 0.52, width * 0.15, height * 0.1);

      // Window
      ctx.fillStyle = '#BFDBFE';
      ctx.fillRect(width * 0.65, height * 0.15, width * 0.25, height * 0.3);
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 4;
      ctx.strokeRect(width * 0.65, height * 0.15, width * 0.25, height * 0.3);
      break;

    case 'party':
      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#FCE7F3');
      gradient.addColorStop(1, '#FEF3C7');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Balloons
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(width * 0.2, height * 0.2, 30, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#3B82F6';
      ctx.beginPath();
      ctx.arc(width * 0.4, height * 0.15, 35, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#22C55E';
      ctx.beginPath();
      ctx.arc(width * 0.8, height * 0.25, 28, 0, 2 * Math.PI);
      ctx.fill();
      break;

    default:
      // Generic room
      ctx.fillStyle = '#F3F4F6';
      ctx.fillRect(0, 0, width, height);

      // Simple floor line
      ctx.strokeStyle = '#9CA3AF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.7);
      ctx.lineTo(width, height * 0.7);
      ctx.stroke();
  }

  return canvas.toDataURL('image/png');
};
