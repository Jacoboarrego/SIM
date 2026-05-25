import { useEffect, useState } from 'react';
import { sliderImages } from '../data/sliderImages';

function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideKey, setSlideKey] = useState(0);
  const total = sliderImages.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(interval);
  }, [total]);

  useEffect(() => {
    setSlideKey((prev) => prev + 1);
  }, [currentIndex]);

  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + total) % total);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % total);

  return (
    <section className="image-slider">
      <div className="slider-window">
        <img
          key={slideKey}
          className="slider-image"
          src={sliderImages[currentIndex].src}
          alt={sliderImages[currentIndex].title}
          loading="lazy"
        />
        <div className="slider-caption">{sliderImages[currentIndex].title}</div>
      </div>
      <div className="slider-controls">
        <button className="btn secondary small slider-nav" type="button" onClick={handlePrev} aria-label="Anterior">
          ◀
        </button>
        <div className="slider-dots">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
        <button className="btn secondary small slider-nav" type="button" onClick={handleNext} aria-label="Siguiente">
          ▶
        </button>
      </div>
    </section>
  );
}

export default ImageSlider;
