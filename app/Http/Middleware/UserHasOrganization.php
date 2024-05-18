<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Repositories\User\UserRepository;
use Symfony\Component\HttpFoundation\Response;

class UserHasOrganization
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (config('app.env') === 'local') {
            return $next($request);
        }
        $user = Auth::user();
        $organizationParameter = $request->route()->parameters('organization');
        $organizationParameterCollection = collect($organizationParameter);

        $userRepository = new UserRepository;

        if ($userRepository->getOrganization($user['id'], $organizationParameterCollection['organization']['id'])) {
            return $next($request);
        }
        return redirect('organizations')->with(['error' => 'Organisasi Belum Tertaut Dengan Akun Anda']);

    }
}
