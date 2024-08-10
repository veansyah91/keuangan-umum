<?php

namespace App\Http\Controllers\Admin;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Affiliation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AdminUserController extends Controller
{
    protected function codeRecomendation($name)
    {
        $affiliate = Affiliation::whereNoRef($name)->get()->last();
        return $affiliate;
    }

    public function index()
    {
        $affiliationFilter = filter_var(request('affiliationFilterQuery'), FILTER_VALIDATE_BOOLEAN);
        
        $users = User::filter(request(['search', 'start_date', 'end_date']))
                        ->when($affiliationFilter == true, function ($query){
                            return $query->has('affilation');
                        })
                        ->whereNot('role', 'super-admin')
                        ->paginate(50)
                        ->withQueryString();

        $userCollection = $users->map(function ($user) {
            $date = new Carbon($user['created_at']);
            $affilate = Affiliation::where('user_id', $user['id'])->first();

            return [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'date' => $date->isoFormat('D MMMM Y'),
                'role' => $user['role'],
                'email_verified_at' => $user['email_verified_at'],
                'affiliation' => $affilate ? $affilate['no_ref'] : ''
            ];
        });

        return Inertia::render('Admin/User/Index', [
            'users' => $users,
            'userCollections' => $userCollection,
            'searchFilter' => request('searchFilter'),
            'affiliateCodeRecommendation' => Inertia::lazy(fn () => $this->codeRecomendation(request('name'))),
            'affiliationFilterQuery' => request('affiliationFilterQuery')
        ]);
    }

    public function storeAffiliation(Request $request, User $user)
    {
        $validated = $request->validate([
            'no_ref' => [
                'required',
                'unique:affiliations',
                'string'
            ],
            'insentive' => [
                'required',
                'numeric',
            ]
        ]);

        $validated['user_id'] = $user['id'];

        Affiliation::create($validated);

        return redirect()->back();
    }
}
