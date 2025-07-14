// Recommendation engine utilities for Giga Talentos platform

export interface RecommendationScore {
  contentId: string;
  score: number;
  reasons: string[];
  contentType: 'video' | 'projeto' | 'desafio';
}

export interface UserPreferences {
  categories: string[];
  interactionHistory: {
    contentId: string;
    contentType: string;
    action: 'view' | 'like' | 'share' | 'follow';
    timestamp: Date;
  }[];
  userType: 'talent' | 'sponsor' | 'fan' | 'other';
}

/**
 * Calculate popularity score based on engagement metrics
 */
export function calculatePopularityScore(content: any): number {
  let score = 0;
  
  // Base score for views/participants/followers
  if (content.views) score += Math.log(content.views + 1) * 0.3;
  if (content.participants) score += Math.log(content.participants + 1) * 0.4;
  if (content.seguidores) score += Math.log(content.seguidores + 1) * 0.3;
  
  // Bonus for likes/engagement
  if (content.likes) score += Math.log(content.likes + 1) * 0.2;
  
  // Bonus for recent content
  if (content.criado_em || content.created_at) {
    const createdAt = new Date(content.criado_em || content.created_at);
    const daysSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    const recencyBonus = Math.max(0, 1 - daysSinceCreation / 30); // Decay over 30 days
    score += recencyBonus * 0.1;
  }
  
  // Bonus for featured content
  if (content.featured) score += 0.5;
  
  // Bonus for completed projects
  if (content.status === 'concluido') score += 0.3;
  
  return score;
}

/**
 * Get personalized weight multipliers based on user type
 */
export function getUserTypeWeights(userType: string) {
  const weights = {
    talent: {
      desafio: 1.5,
      projeto: 1.2,
      video: 1.0,
      educational: 1.3,
      tutorial: 1.4
    },
    sponsor: {
      projeto: 1.5,
      video: 1.2,
      desafio: 0.8,
      highEngagement: 1.3,
      completed: 1.4
    },
    fan: {
      video: 1.3,
      projeto: 1.2,
      desafio: 1.0,
      popular: 1.3
    },
    other: {
      video: 1.0,
      projeto: 1.0,
      desafio: 1.0
    }
  };
  
  return weights[userType as keyof typeof weights] || weights.other;
}

/**
 * Filter content based on user preferences and categories
 */
export function filterByUserPreferences(
  content: any[],
  userCategories: string[],
  userType: string
): any[] {
  if (!userCategories.length) return content;
  
  return content.filter(item => {
    // Check if content matches user's preferred categories
    const itemCategory = item.category?.name || item.categoria;
    if (itemCategory && userCategories.includes(itemCategory)) {
      return true;
    }
    
    // Include popular content regardless of category preferences
    const popularityScore = calculatePopularityScore(item);
    return popularityScore > 2.0; // Threshold for "popular" content
  });
}

/**
 * Generate recommendation reasons for transparency
 */
export function generateRecommendationReasons(
  content: any,
  userType: string,
  isPersonalized: boolean
): string[] {
  const reasons: string[] = [];
  
  if (content.featured) {
    reasons.push('Conteúdo em destaque');
  }
  
  if (content.views && content.views > 500) {
    reasons.push('Muito popular');
  }
  
  if (content.participants && content.participants > 100) {
    reasons.push('Muitos participantes');
  }
  
  if (content.seguidores && content.seguidores > 50) {
    reasons.push('Muitos seguidores');
  }
  
  if (content.status === 'concluido') {
    reasons.push('Projeto concluído com sucesso');
  }
  
  if (isPersonalized) {
    switch (userType) {
      case 'talent':
        if (content.type === 'desafio') {
          reasons.push('Oportunidade para talentos');
        }
        break;
      case 'sponsor':
        if (content.type === 'projeto' && content.seguidores) {
          reasons.push('Projeto promissor para patrocínio');
        }
        break;
      case 'fan':
        if (content.views && content.views > 200) {
          reasons.push('Conteúdo popular entre fãs');
        }
        break;
    }
  }
  
  if (reasons.length === 0) {
    reasons.push('Recomendado para você');
  }
  
  return reasons;
}

/**
 * Shuffle array while maintaining some preference order
 */
export function intelligentShuffle<T>(
  array: T[],
  scoreFunction: (item: T) => number
): T[] {
  // Sort by score first
  const sorted = [...array].sort((a, b) => scoreFunction(b) - scoreFunction(a));
  
  // Apply controlled randomization - higher scored items have higher chance to appear first
  const result: T[] = [];
  const remaining = [...sorted];
  
  while (remaining.length > 0) {
    // Create weighted probabilities (higher scores get higher probability)
    const weights = remaining.map((_, index) => 
      Math.pow(0.8, index) // Exponential decay for position-based weighting
    );
    
    // Select random index based on weights
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    let selectedIndex = 0;
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        selectedIndex = i;
        break;
      }
    }
    
    result.push(remaining[selectedIndex]);
    remaining.splice(selectedIndex, 1);
  }
  
  return result;
}

/**
 * Main recommendation function that combines all strategies
 */
export function generateRecommendations(
  allContent: any[],
  userPreferences: UserPreferences,
  limit: number = 6
): RecommendationScore[] {
  const { userType, categories: userCategories } = userPreferences;
  const weights = getUserTypeWeights(userType);
  
  // Filter and score content
  const recommendations = allContent.map(content => {
    let score = calculatePopularityScore(content);
    
    // Apply user type weights
    const contentType = content.type;
    if (weights[contentType as keyof typeof weights]) {
      score *= weights[contentType as keyof typeof weights];
    }
    
    // Boost score for matching categories
    const itemCategory = content.category?.name || content.categoria;
    if (itemCategory && userCategories.includes(itemCategory)) {
      score *= 1.3;
    }
    
    const reasons = generateRecommendationReasons(
      content,
      userType,
      userCategories.length > 0
    );
    
    return {
      contentId: content._id,
      score,
      reasons,
      contentType: content.type,
      content
    };
  });
  
  // Sort by score and apply intelligent shuffle
  const shuffled = intelligentShuffle(
    recommendations,
    (item) => item.score
  );
  
  return shuffled.slice(0, limit);
}
