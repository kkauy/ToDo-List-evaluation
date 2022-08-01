// API calls
const BASE_URL = 'http://localhost:3000';
const postsPath = 'todos';
const getPosts = () => {
  const postsEndPoint = [BASE_URL, postsPath].join('/');
  return fetch(postsEndPoint).then((response) => {
    return response.json();
  });
};



// INIT
const init = () => {
    renderPostPage();
  
    getPosts().then((data) => {
      state.posts = data;
    });
  };
  
init();
  