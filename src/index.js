import Notifix from 'notiflix';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

import getData from './getData';

const FORM = document.querySelector('#search-form');
const SEARCH_BAR = document.querySelector('#search-form input');
const SEARCH_BUTTON = document.querySelector('#search-form button');
SEARCH_BUTTON.textContent = '\u{1F50D}';
const GALLERY = document.querySelector('.gallery');
const LOAD_MORE_BTN = document.querySelector('.load-more');

const params = {
  per_page: 40,
  page: 1,
  q: '',
};

const updateSearchParams = event => {
  params.q = event.target.value.trim().replace(/\s+/g, '+');
};

const convertImages = picturesArray => {
  return picturesArray.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return `<div style='border: 1px solid black; border-radius: 4px'>
          <a href="${largeImageURL}">
            <img style='width: 22.5vw; height: 14vw; object-fit: cover' src=${webformatURL} alt=${tags}/>
          </a>
          <div style='display: flex; text-align: center; flex-wrap: wrap; gap: 4px; justify-content: space-around; width: 22.5vw; padding: 4px; font-size: 14px'>
            <div style='text-align: center;'>
            <b>Likes</b>
            <p>${likes}</p>
            </div>
            <div style='text-align: center;'>
            <b>Views</b>
            <p>${views}</p>
            </div>
            <div style='text-align: center;'>
            <b>Comments</b>
            <p>${comments}</p>
            </div>
            <div style='text-align: center;'>
            <b>Downloads</b>
            <p>${downloads}</p>
            </div>
          </div>

      </div>`;
    }
  );
};

const updateImages = async params => {
  const data = await getData(params);
  const picturesArray = data.data.hits;

  if (picturesArray.length === 0) {
    Notifix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  const imagesQTT = data.data.totalHits;
  const pagesQTT = Math.ceil(imagesQTT / params.per_page);
  const images = convertImages(picturesArray).join('');
  GALLERY.innerHTML += images;
  const lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
  });
  if (params.page < pagesQTT) {
    LOAD_MORE_BTN.classList.remove('hidden');
  }

  if (params.page === 1) {
    Notifix.Notify.info(`Hooray! We found ${imagesQTT} images.`);
  }

  if (params.page !== 1 && params.page <= pagesQTT) {
    Notifix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
};

const initialLoad = event => {
  event.preventDefault();
  if (params.q === '') {
    Notifix.Notify.warning('please fill in the text box.');
    return;
  }
  params.page = 1;
  GALLERY.innerHTML = '';
  updateImages(params);
};

const loadMore = () => {
  LOAD_MORE_BTN.classList.add('hidden');
  params.page += 1;
  updateImages(params);
};

SEARCH_BAR.addEventListener('input', updateSearchParams);
FORM.addEventListener('submit', initialLoad);
LOAD_MORE_BTN.addEventListener('click', loadMore);
