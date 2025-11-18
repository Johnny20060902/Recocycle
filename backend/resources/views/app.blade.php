<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title inertia>{{ config('app.name', 'Recocycle') }}</title>

  <!-- ==================== Fuentes ==================== -->
  <link rel="preconnect" href="https://fonts.bunny.net">
  <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

  <!-- ==================== Notika CSS ==================== -->
  <link rel="stylesheet" href="{{ asset('notika/css/bootstrap.min.css') }}">
  <link rel="stylesheet" href="{{ asset('notika/css/font-awesome.min.css') }}">
  <link rel="stylesheet" href="{{ asset('notika/css/notika-custom-icon.css') }}">
  <link rel="stylesheet" href="{{ asset('notika/css/animate.css') }}">
  <link rel="stylesheet" href="{{ asset('notika/css/main.css') }}">
  <link rel="stylesheet" href="{{ asset('notika/style.css') }}">
  <link rel="stylesheet" href="{{ asset('notika/css/responsive.css') }}">

  <!-- ==================== Bootstrap Icons ==================== -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

  <!-- ==================== Inertia / Vite ==================== -->
  @routes
  @viteReactRefresh
  @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
  @inertiaHead
</head>

<body class="font-sans antialiased bg-light">
  @inertia

  <!-- ==================== Notika JS ==================== -->
  <script src="{{ asset('notika/js/vendor/jquery-1.12.4.min.js') }}"></script>
  <script src="{{ asset('notika/js/bootstrap.min.js') }}"></script>

  <!-- Plugins requeridos -->
  <script src="{{ asset('notika/js/owl.carousel.min.js') }}"></script>
  <script src="{{ asset('notika/js/meanmenu/jquery.meanmenu.js') }}"></script>
  <script src="{{ asset('notika/js/scrollbar/jquery.mCustomScrollbar.concat.min.js') }}"></script>

  <!-- Slider -->
  <script src="{{ asset('notika/js/rangle-slider/jquery-ui-1.10.4.custom.min.js') }}"></script>
  <script src="{{ asset('notika/js/rangle-slider/jquery-ui-touch-punch.min.js') }}"></script>
  <script src="{{ asset('notika/js/rangle-slider/rangle-active.js') }}"></script>

  <!-- Extras -->
  <script src="{{ asset('notika/js/jquery.scrollUp.min.js') }}"></script>
  <script src="{{ asset('notika/js/plugins.js') }}"></script>

  <!-- Efectos principales -->
  <script src="{{ asset('notika/js/wow.min.js') }}"></script>
  <script src="{{ asset('notika/js/main.js') }}"></script>

</body>

</html>