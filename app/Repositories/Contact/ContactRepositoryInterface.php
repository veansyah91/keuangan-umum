<?php

namespace App\Repositories\Contact;

interface ContactRepositoryInterface
{
    public function getData($organizationId, $request);
    public function getStudents($organizationId, $contactCategoryId, $request);
}