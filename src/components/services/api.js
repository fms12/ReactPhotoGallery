import axios from 'axios';

const apiKey = process.env.REACT_APP_API_KEY;

const baseURL = "https://www.flickr.com/services/rest/";

const api = axios.create({
    baseURL : baseURL
})

export const getRecentPhotos = async (perPage)=>{
    try {
      const response = await api.get("", {
        params: {
          method: "flickr.photos.getRecent",
          api_key: apiKey,
          format: "json",
          nojsoncallback: 1,
          safe_search: 1,
          per_page: perPage,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
}

export const searchPhotos = async (searchQuery) => {
  try {
    const response = await api.get("", {
      params: {
        method: "flickr.photos.search",
        api_key: apiKey,
        format: "json",
        nojsoncallback: 1,
        safe_search: 1,
        text: searchQuery,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ImageURL = "https://live.staticflickr.com/";