<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InPeriod
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // saat ini diasumsukan bahwa periode buku adalah dari tanggal 1 januari - 31 desember
        // jika dilakukan penulisan, pengubahan atau penhapusan data berbeda tahun, maka akan return ke halaman index
        dd('in period');
        return $next($request);
    }
}
