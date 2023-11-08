import React, { useEffect, useRef, useState } from "react";
import { getRecentPhotos, searchPhotos } from "../services/api";
import Image from "./Image";

import { CircularProgress, ClickAwayListener } from "@mui/material";
import AutoComplete from "./AutoComplete";

function Main() {
  const [queryImages, setQueryImages] = useState([]);
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const intersectionRef = useRef(null);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClickAway = () => {
    setShowSuggestions(false);
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
          <div className="flex flex-grow justify-center">
            <form onSubmit={handleSearchRequest} className="flex">
              <ClickAwayListener onClickAway={handleClickAway}>
                <div className="bg-black items-center border-2 border-solid border-[#222222] border-r-0 rounded-tl-[40px] rounded-bl-[40px] caret-[white] ">
                  <input
                    type="text"
                    className="border-none relative w-[30rem] py-[7px] outline-none leading-6 bg-transparent text-white"
                    value={searchQuery}
                    onChange={handleChange}
                    onFocus={setShowSuggestions}
                    onBlur={setShowSuggestions}
                  />
                </div>
              </ClickAwayListener>
              <button className="border border-[#222222] rounded-r-full cursor-pointer py-[6.5px] w-[5.5rem]  m-0 text-white  bg-[#222222] max-sm:w-[3rem]">
                Search
              </button>
            </form>
            {showSuggestions && (
              <div className="flex justify-center items-center">
                <div className=" absolute  right-[34.5em]   w-[30rem] top-[3.5rem] ">
                  {searchSuggestions.map((suggestion) => (
                    <AutoComplete key={suggestion} suggestion={suggestion} />
                  ))}
                </div>
              </div>
            )}
          </div>
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
