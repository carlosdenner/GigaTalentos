import { useCallback } from 'react';
import { useSession } from 'next-auth/react';

export interface InteractionData {
  contentId: string;
  contentType: 'video' | 'projeto' | 'desafio';
  action: 'view' | 'like' | 'share' | 'follow' | 'click' | 'favorite';
  metadata?: {
    duration?: number;
    source?: string;
    position?: number;
    [key: string]: any;
  };
}

export function useAnalytics() {
  const { data: session } = useSession();

  const trackInteraction = useCallback(async (data: InteractionData) => {
    // Only track if user is logged in
    if (!session?.user) return;

    try {
      await fetch('/api/analytics/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
      // Fail silently to not disrupt user experience
    }
  }, [session]);

  const trackView = useCallback((contentId: string, contentType: InteractionData['contentType'], metadata?: InteractionData['metadata']) => {
    trackInteraction({
      contentId,
      contentType,
      action: 'view',
      metadata
    });
  }, [trackInteraction]);

  const trackClick = useCallback((contentId: string, contentType: InteractionData['contentType'], metadata?: InteractionData['metadata']) => {
    trackInteraction({
      contentId,
      contentType,
      action: 'click',
      metadata
    });
  }, [trackInteraction]);

  const trackLike = useCallback((contentId: string, contentType: InteractionData['contentType']) => {
    trackInteraction({
      contentId,
      contentType,
      action: 'like'
    });
  }, [trackInteraction]);

  const trackShare = useCallback((contentId: string, contentType: InteractionData['contentType'], platform?: string) => {
    trackInteraction({
      contentId,
      contentType,
      action: 'share',
      metadata: { platform }
    });
  }, [trackInteraction]);

  const trackFavorite = useCallback((contentId: string, contentType: InteractionData['contentType']) => {
    trackInteraction({
      contentId,
      contentType,
      action: 'favorite'
    });
  }, [trackInteraction]);

  return {
    trackInteraction,
    trackView,
    trackClick,
    trackLike,
    trackShare,
    trackFavorite
  };
}
