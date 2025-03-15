export type placesTypes = {
  id: number;
  name: string;
  image: string;
  desc: string;
  rating: number;
  price: number;
  duration: string;
  location: {
    latitude: number;
    longitude: number;
  };
  category: string;
};
