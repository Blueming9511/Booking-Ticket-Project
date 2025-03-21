import { useState } from "react";

const useSlider = (slides) => {
  const [currentSlides, setCurrentSlides] = useState(slides);

  const nextSlide = () => {
    setCurrentSlides((prevSlides) => [...prevSlides.slice(1), prevSlides[0]]);
  };

  const prevSlide = () => {
    setCurrentSlides((prevSlides) => [
      prevSlides[prevSlides.length - 1],
      ...prevSlides.slice(0, prevSlides.length - 1),
    ]);
  };

  return { currentSlides, nextSlide, prevSlide };
};

export default useSlider;
