import React, { useEffect, useRef, useState } from 'react';
import './Home.css';
import Navbar from '../components/Navbar';

import metadata from '../data/metadata.json';
import highlight1 from '../assets/categories/highlight/h1.jpg';
import highlight2 from '../assets/categories/highlight/h2.jpg';
import highlight3 from '../assets/categories/highlight/h3.jpg';

const templateId = metadata.template.id;
const categoryCount = metadata.category.count;    

const heroBg = require(`../assets/templates/${templateId}/hero-bg.jpg`);
const flourishImage = require(`../assets/templates/${templateId}/flourish.png`);
const flowerCorner = require(`../assets/templates/${templateId}/hero-corner_transparent.png`);

// Dynamically import category covers
const categoryCovers = Array.from({ length: categoryCount }, (_, i) => 
  require(`../assets/categories/gallery/${i + 1}/foto1.jpeg`)
);

// Import all photos from category 1 if there's only one category
const allPhotos = categoryCount === 1 ? 
  (() => {
    const photos = [];
    let i = 1;
    try {
      while (true) {
        photos.push(require(`../assets/categories/gallery/1/foto${i}.jpeg`));
        i++;
      }
    } catch (e) {
      // Stop when we can't import more photos
    }
    return photos;
  })() : 
  [];

const Home: React.FC = () => {
  const journeyContentRef = useRef<HTMLDivElement>(null);
  const weddingTitleRef = useRef<HTMLHeadingElement>(null);
  const detailCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [modalTouchStart, setModalTouchStart] = useState<number | null>(null);
  const [modalTouchEnd, setModalTouchEnd] = useState<number | null>(null);
  const [photosPerPage, setPhotosPerPage] = useState(9);

  useEffect(() => {
    const updatePhotosPerPage = () => {
      if (window.innerWidth <= 480) {
        setPhotosPerPage(8); // For mobile: 8 photos (2x4 grid)
      } else if (window.innerWidth <= 768) {
        setPhotosPerPage(8); // For tablet: 8 photos (2x4 grid)
      } else {
        setPhotosPerPage(9); // For desktop: 9 photos (3x3 grid)
      }
    };

    updatePhotosPerPage();
    window.addEventListener('resize', updatePhotosPerPage);

    return () => {
      window.removeEventListener('resize', updatePhotosPerPage);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    if (journeyContentRef.current) {
      observer.observe(journeyContentRef.current);
    }

    if (weddingTitleRef.current) {
      observer.observe(weddingTitleRef.current);
    }

    detailCardsRef.current.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    // Capture current refs for cleanup
    const journeyContent = journeyContentRef.current;
    const weddingTitle = weddingTitleRef.current;
    const detailCards = [...detailCardsRef.current];

    return () => {
      if (journeyContent) {
        observer.unobserve(journeyContent);
      }
      if (weddingTitle) {
        observer.unobserve(weddingTitle);
      }
      detailCards.forEach((card) => {
        if (card) {
          observer.unobserve(card);
        }
      });
    };
  }, []);

  const setDetailCardRef = (index: number) => (el: HTMLDivElement | null) => {
    detailCardsRef.current[index] = el;
  };

  const totalPages = Math.ceil(allPhotos.length / photosPerPage);
  const startIndex = (currentPage - 1) * photosPerPage;
  const endIndex = startIndex + photosPerPage;
  const currentPhotos = allPhotos.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleImageClick = (index: number) => {
    setSelectedImage(startIndex + index);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleModalNavigation = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    if (direction === 'prev' && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    } else if (direction === 'next' && selectedImage < allPhotos.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
    if (isRightSwipe && currentPage > 1) {
      handlePageChange(currentPage - 1);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleModalTouchStart = (e: React.TouchEvent) => {
    setModalTouchStart(e.targetTouches[0].clientX);
  };

  const handleModalTouchMove = (e: React.TouchEvent) => {
    setModalTouchEnd(e.targetTouches[0].clientX);
  };

  const handleModalTouchEnd = () => {
    if (!modalTouchStart || !modalTouchEnd) return;

    const distance = modalTouchStart - modalTouchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleModalNavigation('next');
    }
    if (isRightSwipe) {
      handleModalNavigation('prev');
    }

    setModalTouchStart(null);
    setModalTouchEnd(null);
  };

  return (
    <div className="home" data-template={templateId}>
      <Navbar />
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container-outer"></div>
        <div className="hero-container-inner"></div>
        <img 
          src={heroBg} 
          alt="" 
          className="hero-background" 
        />
        <img 
          src={flowerCorner} 
          alt="" 
          className="flower-corner top-right" 
        />
        <img 
          src={flowerCorner} 
          alt="" 
          className="flower-corner top-left" 
        />
        <div className="hero-content">
          <h1 className="hero-names">
            <span className="name">{metadata.hero.name1}</span>
            <span className="and">&</span>
            <span className="name">{metadata.hero.name2}</span>
          </h1>
          <h2 className="subtitle">{metadata.hero.subtitle}</h2>
          <p className="date-location">
            <span>{metadata.hero.date}</span>
            <span>{metadata.hero.year}</span>
            <span className="separator">|</span>
            <span>{metadata.hero.location}</span>
          </p>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="photo-gallery">
        <div className="gallery-container">
          <div className="oval-photo">
            <img src={highlight1} alt="Highlight 1" />
          </div>
          <div className="oval-photo">
            <img src={highlight2} alt="Highlight 2" />
          </div>
          <div className="oval-photo">
            <img src={highlight3} alt="Highlight 3" />
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="journey">
        <img 
          src={heroBg} 
          alt="" 
          className="journey-background" 
        />
        <div className="journey-content" ref={journeyContentRef}>
          <img 
            src={flourishImage} 
            alt="" 
            className="flourish-image"
          />
          <h2>{metadata.journey.title}</h2>
          <p className="subtitle">{metadata.journey.subtitle}</p>
          <p className="description">
            {metadata.journey.description}
          </p>
        </div>
      </section>

      {/* Wedding Details Section */}
      <section className="wedding-details">
        <h2 ref={weddingTitleRef}>{metadata.category.title}</h2>
        {categoryCount === 1 ? (
          <>
            <div 
              className="gallery-grid"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {currentPhotos.map((photo, index) => (
                <div 
                  className="gallery-item" 
                  key={index}
                  onClick={() => handleImageClick(index)}
                >
                  <img src={photo} alt={`Gallery ${startIndex + index + 1}`} />
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={currentPage === i + 1 ? 'active' : ''}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="details-grid">
            {Array.from({ length: categoryCount }, (_, i) => (
              <div className="detail-card" ref={setDetailCardRef(i)} key={i}>
                <img src={categoryCovers[i]} alt={metadata.category.categories[i].title} />
                <h3>{metadata.category.categories[i].title}</h3>
                <p>{metadata.category.categories[i].text}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal for full-screen image view */}
      {selectedImage !== null && (
        <div 
          className="image-modal"
          onTouchStart={handleModalTouchStart}
          onTouchMove={handleModalTouchMove}
          onTouchEnd={handleModalTouchEnd}
        >
          <button className="modal-close" onClick={handleCloseModal}>×</button>
          <button 
            className="modal-nav prev" 
            onClick={() => handleModalNavigation('prev')}
            disabled={selectedImage === 0}
          >
            ←
          </button>
          <img 
            src={allPhotos[selectedImage]} 
            alt={`Gallery ${selectedImage + 1}`} 
            className="modal-image"
          />
          <button 
            className="modal-nav next" 
            onClick={() => handleModalNavigation('next')}
            disabled={selectedImage === allPhotos.length - 1}
          >
            →
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <img 
          src={heroBg} 
          alt="" 
          className="footer-background" 
        />
        <div className="footer-content">
           <p>{metadata.footer.line1}</p>
           <p>{metadata.footer.line2}</p>
        </div>
      </footer>
    </div>
  );
};

export default Home; 