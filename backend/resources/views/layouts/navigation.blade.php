<nav x-data="{ open: false }" class="bg-white border-b border-gray-100">
    <!-- Primary Navigation Menu -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex items-center">
                <!-- Logo -->
                <div class="shrink-0 flex items-center">
                    <a href="{{ auth()->check() ? route('dashboard') : route('home') }}" class="flex items-center gap-2">
                        <img src="/images/logo-recocycle.png" alt="Recocycle" class="h-9 w-9 rounded" />
                        <span class="hidden sm:block font-semibold text-gray-800">Recocycle</span>
                    </a>
                </div>

                <!-- Navigation Links (solo autenticado) -->
                @auth
                <div class="hidden sm:flex sm:ms-10">
                    <a href="{{ route('dashboard') }}"
                       class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                              {{ request()->routeIs('dashboard') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' }}">
                        Dashboard
                    </a>
                </div>
                @endauth
            </div>

            <!-- Right side -->
            <div class="hidden sm:flex sm:items-center sm:ms-6">
                @auth
                    <!-- Simple dropdown sin componentes -->
                    <div x-data="{ dd:false }" class="relative">
                        <button @click="dd = !dd"
                                class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-800">
                            <span>{{ auth()->user()->name ?? auth()->user()->nombres ?? 'Usuario' }}</span>
                            <svg class="ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
                            </svg>
                        </button>

                        <div x-show="dd" @click.outside="dd=false"
                             class="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-md py-1 z-50">
                            @if (Route::has('profile.edit'))
                                <a href="{{ route('profile.edit') }}"
                                   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Profile
                                </a>
                            @endif

                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <button type="submit"
                                        class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Log Out
                                </button>
                            </form>
                        </div>
                    </div>
                @else
                    <div class="flex items-center gap-3">
                        <a class="text-sm text-gray-600 hover:text-gray-900" href="{{ route('login') }}">Iniciar sesión</a>
                        @if (Route::has('register'))
                            <a class="text-sm text-gray-600 hover:text-gray-900" href="{{ route('register') }}">Registrarse</a>
                        @endif
                    </div>
                @endauth
            </div>

            <!-- Hamburger -->
            <div class="-me-2 flex items-center sm:hidden">
                <button @click="open = ! open"
                        class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100
                               focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
                    <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path :class="{ 'hidden': open, 'inline-flex': !open }" class="inline-flex" stroke-linecap="round"
                              stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                        <path :class="{ 'hidden': !open, 'inline-flex': open }" class="hidden" stroke-linecap="round"
                              stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Responsive Navigation Menu -->
    <div :class="{ 'block': open, 'hidden': !open }" class="hidden sm:hidden">
        @auth
            <div class="pt-2 pb-3 space-y-1">
                <a href="{{ route('dashboard') }}"
                   class="block ps-3 pe-4 py-2 border-l-4 text-base font-medium
                          {{ request()->routeIs('dashboard') ? 'border-indigo-500 text-indigo-700 bg-indigo-50' : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300' }}">
                    Dashboard
                </a>
            </div>

            <!-- Responsive Settings Options -->
            <div class="pt-4 pb-1 border-t border-gray-200">
                <div class="px-4">
                    <div class="font-medium text-base text-gray-800">
                        {{ auth()->user()->name ?? auth()->user()->nombres ?? 'Usuario' }}
                    </div>
                    <div class="font-medium text-sm text-gray-500">
                        {{ auth()->user()->email }}
                    </div>
                </div>

                <div class="mt-3 space-y-1">
                    @if (Route::has('profile.edit'))
                        <a href="{{ route('profile.edit') }}"
                           class="block ps-3 pe-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
                            Profile
                        </a>
                    @endif

                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit"
                                class="w-full text-left block ps-3 pe-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
                            Log Out
                        </button>
                    </form>
                </div>
            </div>
        @else
            <div class="pt-2 pb-3 space-y-1">
                <a href="{{ route('home') }}"
                   class="block ps-3 pe-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
                    Inicio
                </a>
                <a href="{{ route('login') }}"
                   class="block ps-3 pe-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
                    Iniciar sesión
                </a>
                @if (Route::has('register'))
                <a href="{{ route('register') }}"
                   class="block ps-3 pe-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
                    Registrarse
                </a>
                @endif
            </div>
        @endauth
    </div>
</nav>
