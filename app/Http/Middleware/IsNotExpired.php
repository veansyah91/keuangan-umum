<?php

namespace App\Http\Middleware;

use Closure;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class IsNotExpired
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

        $now = Carbon::now();

        if ($organizationParameterCollection['organization']->expired < $now) {
            return redirect('organizations')->with('error', $organizationParameterCollection['organization']->name . ' Sudah Kadaluarsa, Silakan melakukan perpanjangan');
        }

        return $next($request);
    }
}
