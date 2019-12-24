<style>
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: center;
    align-items: center;
    grid-gap: 1rem;
  }

  .img-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .img-wrapper a {
    display: block;
    transition: box-shadow 200ms;
  }

  .img-wrapper a:hover {
    box-shadow: 0 2px 4px 0px rgba(0, 0, 0, 0.5);
  }

  .img-wrapper img {
    height: 200px;
    width: 100%;
    object-fit: cover;
  }
</style>

<div style="" class="grid">
  <div class="img-wrapper">
    <a
      href="https://res.cloudinary.com/dhhjogfy6/image/upload/c_scale,q_auto:good,w_1200,f_auto/v1577207877/img/promo-2.jpg"
      target="_blank"
      rel="noopener noreferrer nofollow">
      <img
        alt="Photo of Nick Ball against a door"
        src="https://res.cloudinary.com/dhhjogfy6/image/upload/c_scale,q_auto:good,w_400,f_auto/v1577207877/img/promo-2.jpg" />
    </a>
  </div>
  <div class="img-wrapper">
    <a
      href="https://res.cloudinary.com/dhhjogfy6/image/upload/c_scale,q_auto:good,w_1200,f_auto/v1577207877/img/promo-3.jpg"
      target="_blank"
      rel="noopener noreferrer nofollow">
      <img
        alt="Photo of Nick Ball against a bush"
        class="object-bottom"
        src="https://res.cloudinary.com/dhhjogfy6/image/upload/c_scale,q_auto:good,w_400,f_auto/v1577207877/img/promo-3.jpg" />
    </a>
  </div>
</div>
