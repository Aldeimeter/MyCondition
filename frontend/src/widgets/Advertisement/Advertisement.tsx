import { IAdvertisement } from "@/entities/ad";
import { api } from "@/shared/api";
import React, { useEffect, useState } from "react";

export const Advertisement = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [advertisement, setAdvertisement] = useState<IAdvertisement>({
    imgUrl: "",
    targetUrl: "",
  });

  useEffect(() => {
    const fetchAndShowAd = async () => {
      try {
        const response = await api.get("/ad/active");
        if (!response.data.activeAd) {
          alert("Active ad is not set");
          return;
        }
        setAdvertisement(response.data.activeAd);
        setIsVisible(true);
        setTimeout(() => setIsVisible(false), 5000);
      } catch (error) {
        console.error("Error while fetching ad", error);
      }
    };

    fetchAndShowAd();
    const intervalId = setInterval(fetchAndShowAd, 60000);

    return () => clearInterval(intervalId);
  }, []);
  const handleImageClick = async () => {
    try {
      if (advertisement.id) {
        await api.patch(`/ad/increment/${advertisement.id}`);
      }
    } catch (error) {
      console.error("Error incrementing ad click counter", error);
    }
  };
  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white border border-gray-300 shadow-lg p-6 rounded-lg z-50 relative">
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 bg-gray-200 text-gray-700 rounded-full px-2"
              aria-label="Close"
            >
              ✕
            </button>
            <a
              href={advertisement.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleImageClick}
            >
              <img
                src={advertisement.imgUrl}
                alt="Advertisement"
                className="w-full h-auto max-w-sm"
              />
            </a>
          </div>
        </div>
      )}
    </>
  );
};
