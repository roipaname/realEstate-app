type Property = {
  id: string;
  address: string;
  dateAdded: any;
  description: string;
  imageUrls: string[];
  latitude: number;
  longitude: number;
  price: number;
  title: string;
  type?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  owner?: {
    name: string;
    avatar?: string;
    phone?: string;
    email?: string;
    id: string;
  };
  rating?: number;
  reviews?: number;
  comments?: {
    id: string;
    user: string;
    avatar?: string;
    comment: string;
    rating: number;
    date: string;
  }[];
  amenities?: string[];
  yearBuilt?: number;
  parking?: number;
};

type CachedUser = {
  id: string;
  name?: string | undefined;
  email?: string | undefined;
  phone?: string | undefined;
  avatar?: string | undefined;
  role?: string;
  profilePic?: string;
  dateJoined?: string;
};

type RegionType = {
  city?: string;
  region?: string;
  country?: string;
};

type FilterType = {
  type: string;
  minPrice: number;
  maxPrice: number;
  minBedrooms: number;
  maxBedrooms: number;
};

export { Property, CachedUser, RegionType, FilterType };
