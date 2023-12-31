import React, { useEffect, useRef, useState } from "react";
import { getRecentPhotos, searchPhotos } from "../services/api";
import Image from "./Image";

import { CircularProgress, ClickAwayListener } from "@mui/material";
import AutoComplete from "./AutoComplete";
import Search from "./Search";

function Main() {
  const [queryImages, setQueryImages] = useState([]);
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const intersectionRef = useRef(null);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const savedSearches = localStorage.getItem("savedSearches");
    const suggestions = savedSearches ? JSON.parse(savedSearches) : [];
    setSearchSuggestions(suggestions);
  }, []);

  useEffect(() => {
    fetchImageData();
  }, [page, perPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          // When the intersection is observed, load more images
          // Increase perPage when scrolling
          setPerPage((prevPerPage) => prevPerPage + 1); // Adjust as needed
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    if (intersectionRef.current) {
      observer.observe(intersectionRef.current);
    }

    return () => {
      if (intersectionRef.current) {
        observer.unobserve(intersectionRef.current);
      }
    };
  }, [loading]);

  // Fetch images with the specified per_page value

  const fetchImageData = async () => {
    setLoading(true);
    try {
      const data = await getRecentPhotos(perPage, page);
      if (page === 1) {
        setImages(data.photos.photo);
      } else {
        const newImages = data.photos.photo.filter((newImage) => {
          return !images.some(
            (existingImage) => existingImage.id === newImage.id
          );
        });
        setImages((prevImages) => [...prevImages, ...newImages]);
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handling fetching images by search query

  const handleSearchRequest = async (e) => {
    e.preventDefault();

    if (searchQuery.trim() !== "") {
      try {
        const data = await searchPhotos(searchQuery);
        const newSuggestions = [...searchSuggestions, searchQuery];
        setQueryImages(data.photos.photo);
        setSearchSuggestions(newSuggestions);
        localStorage.setItem("savedSearches", JSON.stringify(newSuggestions));
        setSearchQuery("");
      } catch (error) {
        console.error("Error searching for photos:", error);
      }
    }
  };

  if (images < 0) return <CircularProgress />;
  return (
    <div>
      <div className="bg-[#ffc017] fixed top-0 w-full z-50 border-b-2 border-black p-4">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 flex flex-row items-center justify-between">
          <div className="flex flex-shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
              alt="Your Company"
            />
          </div>
          {/* Search section */}
          <Search
            handleChange={handleChange}
            handleSearchRequest={handleSearchRequest}
            searchQuery={searchQuery}
            searchSuggestions={searchSuggestions}
          />
        </div>
      </div>

      {/* Image Grid */}
      <div className="mt-10">
        {queryImages.length > 0 ? (
          <Image images={queryImages} />
        ) : (
          <>
            <Image images={images} />
            <div ref={intersectionRef}></div>
            <div className="flex justify-center items-center">
              {loading && <CircularProgress />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Main;
