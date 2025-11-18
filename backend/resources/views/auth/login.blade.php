<x-guest-layout>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-5">
        <div class="glass-card p-4 p-md-5">
          <div class="text-center mb-3">
            <img src="/images/logo-recocycle.png" alt="Recocycle" width="64" class="rounded-circle shadow-sm mb-2">
            <h1 class="h4 fw-bold mb-0">Iniciar sesión</h1>
            @if(request('role'))
              <div class="small text-secondary mt-1">Rol: <span class="badge badge-role rounded-pill px-3">{{ ucfirst(request('role')) }}</span></div>
            @endif
          </div>

          <!-- Errores -->
          @if ($errors->any())
            <div class="alert alert-danger small">
              <ul class="m-0 ps-3">
                @foreach ($errors->all() as $error)
                  <li>{{ $error }}</li>
                @endforeach
              </ul>
            </div>
          @endif

          <form method="POST" action="{{ route('login') }}" class="needs-validation" novalidate>
            @csrf

            <div class="mb-3">
              <label for="email" class="form-label">Correo electrónico</label>
              <input id="email" class="form-control" type="email" name="email" value="{{ old('email') }}" required autofocus autocomplete="username">
            </div>

            <div class="mb-2">
              <label for="password" class="form-label">Contraseña</label>
              <input id="password" class="form-control" type="password" name="password" required autocomplete="current-password">
            </div>

            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" name="remember" id="remember_me">
                <label class="form-check-label" for="remember_me">Recordarme</label>
              </div>

              @if (Route::has('password.request'))
                <a class="small text-decoration-none" href="{{ route('password.request') }}">
                  ¿Olvidaste tu contraseña?
                </a>
              @endif
            </div>

            <button class="btn btn-recocycle text-white w-100 py-2">Entrar</button>
          </form>

          @if (Route::has('register'))
            <div class="text-center mt-3 small">
              ¿No tienes cuenta?
              <a href="{{ route('register') }}" class="text-decoration-none">Regístrate</a>
            </div>
          @endif
        </div>
      </div>
    </div>
  </div>
</x-guest-layout>
