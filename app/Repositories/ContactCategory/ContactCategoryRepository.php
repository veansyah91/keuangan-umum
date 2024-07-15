<?php

namespace App\Repositories\ContactCategory;

use App\Models\ContactCategory;

class ContactCategoryRepository implements ContactCategoryRepositoryInterface
{
    public function getOrSetData($organizationId, $name)
    {
        $contactCategory = ContactCategory::whereOrganizationId($organizationId)
                                            ->whereName($name)
                                            ->first();

        if (!$contactCategory) {
            ContactCategory::create([
                'name' => $name,
                'organization_id' => $organizationId
            ]); 
        }

        return $contactCategory;
    }
}