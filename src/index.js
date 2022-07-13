import './css/styles.css';
import { PixabayApi } from './js/pixabayApi';
import { getRefs } from './js/getRefs';
import galleryTpl from './templates/imageLayout.hbs';
import { onFetchSuccess, onFetchError, onFetchEnd } from './js/notifications';
import { lightbox } from './js/simpleLightbox';

const refs = getRefs();

const pixabayApi = new PixabayApi();

const onSearch = async e => {
  e.preventDefault();
  const { searchQuery } = e.currentTarget.elements;
  if (searchQuery.value.trim().length !== 0) {
    refs.gallery.innerHTML = '';
    pixabayApi.resetPage();

    pixabayApi.setQuery(searchQuery.value.trim());
    await fetchAndRenderPhotos();
    if (pixabayApi.getTotalHits() !== 0) {
      onFetchSuccess(pixabayApi.getTotalHits());
      runIntersectionObserver();
      searchQuery.value = '';
    }
  } else {
    onFetchError();
  }
};

const fetchAndRenderPhotos = async () => {
  const arrayPromis = await pixabayApi.fetchPhotos();
  if (arrayPromis.length !== 0) {
    refs.gallery.insertAdjacentHTML('beforeend', galleryTpl(arrayPromis));
    lightbox.refresh();
  } else {
    onFetchError();
  }
};

const scrollTop = () => {
  const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

const runIntersectionObserver = () => {
  const callback = async (entries, observer) => {
    if (pixabayApi.page !== pixabayApi.totalPages) {
      if (entries[0].isIntersecting) {
        pixabayApi.increasePage();
        await fetchAndRenderPhotos();
        scrollTop();
        observer.unobserve(entries[0].target);
        observer.observe(document.querySelector('.photo-card:last-child'));
      }
    } else {
      if (entries[0].isIntersecting) {
        observer.unobserve(entries[0].target);
        onFetchEnd();
      }
    }
  };

  const observer = new IntersectionObserver(callback, {
    rootMargin: '0px 0px 200px 0px',
    threshold: 1.0,
  });
  observer.observe(document.querySelector('.photo-card:last-child'));
};

refs.form.addEventListener('submit', onSearch);
