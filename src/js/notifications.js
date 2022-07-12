import Notiflix from 'notiflix';

Notiflix.Notify.init({
  width: '300px',
  closeButton: false,
  distance: '4px',
});

const onFetchSuccess = value => {
  Notiflix.Notify.success(`Hooray! We found ${value} images.`);
};

const onFetchError = () => {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
};

const onFetchEnd = () => {
  Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
};

export { onFetchSuccess, onFetchError, onFetchEnd };
