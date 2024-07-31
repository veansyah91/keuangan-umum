<?php

namespace App\Repositories\Contact;

use App\Models\Contact;
use App\Repositories\Contact\ContactRepositoryInterface;

class ContactRepository implements ContactRepositoryInterface
{
    public function getData($organizationId, $request){
        return Contact::filter($request)
                        ->whereOrganizationId($organizationId)
                        ->with('contactCategories')
                        ->where('is_active', true)
                        ->select('id', 'name', 'phone')
                        ->take(20)
                        ->get();
    }

    public function getStudent($organizationId, $contactCategoryId, $request){
        return Contact::filter($request)
                        ->whereOrganizationId($organizationId)
                        ->with(['contactCategories', 'student', 'levels'])
                        ->whereHas('contactCategories', function ($query) use ($contactCategoryId){
                            $query->where('contact_category_id', $contactCategoryId);
                        })
                        ->orderBy('name')
                        ->take(20)
                        ->get();
    }
}