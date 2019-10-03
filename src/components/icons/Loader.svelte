<script>
  export let size = "24px";
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 64 64">
  <title>Loading icon</title>
  <g fill="#333333">
    <g class="nc-loop_circle-04-64">
      <path
        fill="#333333"
        d="M32,64c-7.39551,0-14.60889-2.58203-20.31104-7.27148c-1.27979-1.05273-1.46436-2.94336-0.41211-4.22266
        c1.05273-1.28027,2.94287-1.46387,4.22266-0.41211C20.13135,55.90234,25.99121,58,32,58c14.33643,0,26-11.66309,26-26
        C58,17.66357,46.33643,6,32,6S6,17.66357,6,32c0,3.70605,0.7627,7.28418,2.26709,10.63574
        c0.67871,1.51172,0.00342,3.28711-1.5083,3.96582c-1.51367,0.67676-3.28711,0.00293-3.96533-1.50879
        C0.93994,40.96387,0,36.55859,0,32C0,14.35498,14.35498,0,32,0s32,14.35498,32,32C64,49.64453,49.64502,64,32,64z"
        transform="rotate(58.60549999400973 32 32)" />
    </g>
    <script>
      !(function() {
        function t(t) {
          (this.element = t),
            (this.circle = this.element.getElementsByTagName("path")[0]),
            this.animationId,
            (this.start = null),
            this.init();
        }
        if (!window.requestAnimationFrame) {
          var i = null;
          window.requestAnimationFrame = function(t, n) {
            var e = new Date().getTime();
            i || (i = e);
            var a = Math.max(0, 16 - (e - i)),
              o = window.setTimeout(function() {
                t(e + a);
              }, a);
            return (i = e + a), o;
          };
        }
        (t.prototype.init = function() {
          var t = this;
          this.animationId = window.requestAnimationFrame(
            t.triggerAnimation.bind(t)
          );
        }),
          (t.prototype.reset = function() {
            var t = this;
            window.cancelAnimationFrame(t.animationId);
          }),
          (t.prototype.triggerAnimation = function(t) {
            var i = this;
            this.start || (this.start = t);
            var n = t - this.start;
            720 > n || (this.start = this.start + 720),
              this.circle.setAttribute(
                "transform",
                "rotate(" + Math.min(n / 2, 360) + " 32 32)"
              );
            if (document.documentElement.contains(this.element))
              window.requestAnimationFrame(i.triggerAnimation.bind(i));
          });
        var n = document.getElementsByClassName("nc-loop_circle-04-64"),
          e = [];
        if (n)
          for (var a = 0; n.length > a; a++)
            !(function(i) {
              e.push(new t(n[i]));
            })(a);
        document.addEventListener("visibilitychange", function() {
          "hidden" == document.visibilityState
            ? e.forEach(function(t) {
                t.reset();
              })
            : e.forEach(function(t) {
                t.init();
              });
        });
      })();
    </script>
  </g>
</svg>
