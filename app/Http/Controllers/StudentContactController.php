<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Helpers\ContactCategoryHelper;
use App\Repositories\ContactCategory\ContactCategoryRepository;

class StudentContactController extends Controller
{
    public function index(Organization $organization)
    {        
        return Inertia::render('Student/Index',[

        ]);
    }
}
