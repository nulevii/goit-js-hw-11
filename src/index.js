import Notifix from 'notiflix';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

import getData from './getData';

const FORM = document.querySelector('#search-form');
const SEARCH_BAR = document.querySelector('#search-form input');
const SEARCH_BUTTON = document.querySelector('#search-form button');
const GALLERY = document.querySelector('.gallery');
const LOAD_MORE_BTN = document.querySelector('.load-more');

const url = 'https://pixabay.com/api/';
const key = '27364037-494c2c1537a13aa746fb2bd48';
const image_type = 'photo';
const orientation = 'horizontal';
const safesearch = true;
const per_page = 40;
let page = 1;
let searchParams = '';

FORM.style =
  'display: flex; justify-content: center; background-color: #4056b4; padding: 10px';
SEARCH_BAR.style =
  'border: 1px solid white; border-radius: 4px 0 0 4px; border-right: none';
SEARCH_BUTTON.style =
  'border: 1px solid white; border-radius: 0 4px 4px 0; border-left: none';
SEARCH_BUTTON.textContent = '\u{1F50D}';
GALLERY.style =
  'display: flex; justify-content: center; flex-wrap: wrap; padding: 20px 0; gap: 1vw';

const updateSearchParams = event => {
  searchParams = event.target.value.trim().replace(/\s+/g, '+');
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

const updateImages = async link => {
  const data = await getData(link);
  const picturesArray = data.data.hits;

  if (picturesArray.length === 0) {
    Notifix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  const imagesQTT = data.data.totalHits;
  const pagesQTT = Math.ceil(imagesQTT / per_page);
  const images = convertImages(picturesArray).join('');
  GALLERY.innerHTML = `${GALLERY.innerHTML} ${images}`;
  const lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
  });
  if (page < pagesQTT) {
    LOAD_MORE_BTN.classList.remove('hidden');
  }
};

const initialLoad = event => {
  event.preventDefault();
  if (searchParams === '') {
    Notifix.Notify.warning('please fill in the text box.');
    return;
  }
  page = 1;
  GALLERY.innerHTML = '';
  const link = `${url}?key=${key}&q=${searchParams}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&page=${page}&per_page=${per_page}`;
  updateImages(link);
};

const loadMore = () => {
  LOAD_MORE_BTN.classList.add('hidden');
  page += 1;
  const link = `${url}?key=${key}&q=${searchParams}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&page=${page}&per_page=${per_page}`;
  updateImages(link);
};

SEARCH_BAR.addEventListener('input', updateSearchParams);
FORM.addEventListener('submit', initialLoad);
LOAD_MORE_BTN.addEventListener('click', loadMore);
