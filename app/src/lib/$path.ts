const buildSuffix = (url?: {query?: Record<string, string>, hash?: string}) => {
  const query = url?.query;
  const hash = url?.hash;
  if (!query && !hash) return '';
  const search = query ? `?${new URLSearchParams(query)}` : '';
  return `${search}${hash ? `#${hash}` : ''}`;
};

export const pagesPath = {
  "camera": {
    $url: (url?: { hash?: string }) => ({ pathname: '/camera' as const, hash: url?.hash, path: `/camera${buildSuffix(url)}` })
  },
  "youtube": {
    "card_ranking": {
      $url: (url?: { hash?: string }) => ({ pathname: '/youtube/card_ranking' as const, hash: url?.hash, path: `/youtube/card_ranking${buildSuffix(url)}` })
    },
    "player_ranking": {
      $url: (url?: { hash?: string }) => ({ pathname: '/youtube/player_ranking' as const, hash: url?.hash, path: `/youtube/player_ranking${buildSuffix(url)}` })
    },
    $url: (url?: { hash?: string }) => ({ pathname: '/youtube' as const, hash: url?.hash, path: `/youtube${buildSuffix(url)}` })
  },
  $url: (url?: { hash?: string }) => ({ pathname: '/' as const, hash: url?.hash, path: `/${buildSuffix(url)}` })
};

export type PagesPath = typeof pagesPath;
