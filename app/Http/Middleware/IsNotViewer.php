<?php

namespace App\Http\Middleware;

use App\Repositories\User\UserRepository;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class IsNotViewer
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        $organizationParameter = $request->route()->parameters('organization');
        $organizationParameterCollection = collect($organizationParameter);

        $userRepository = new UserRepository;

        $data = $userRepository->getOrganization($user['id'], $organizationParameterCollection['organization']['id']);
        $role = $data->organizations[0]['pivot']['role'];

        if ($role === 'viewer') {
            return abort(403);
        }

        return $next($request);
    }
}
