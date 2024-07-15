<?php

namespace App\Repositories\ContactCategory;

interface ContactCategoryRepositoryInterface
{
    public function getOrSetData($organizationId, $name);
}