export interface Asset {
  id: string;
  type: 'username' | 'nft' | 'gift' | 'sticker';
  name: string;
  price: number;
  change_24h: number;
  volume_24h: number;
}

export interface WatchlistItem {
  id: string;
  type: string;
  name: string;
  added_at: string;
}
