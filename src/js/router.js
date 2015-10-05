import page from 'page';

const pageNavEls = Array.from(document.querySelectorAll('.subnav > li > a'));

export default function createRouter() {
    function route(ctx, next) {
        let hash = ctx.hash;

        pageNavEls.map(el => {
            el.classList.remove('active');
            return el;
        })
        .filter(el => el.href = hash)
        .map(el => el.classList.add('active'));
    }

    page('*', route);
    page();
}
