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
}