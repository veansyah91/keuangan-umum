<?php

namespace App\Repositories\Department;

use App\Models\Department;

class DepartmentRepository implements DepartmentRepositoryInterface
{
    public function getData($organizationId)
    {
        return Department::whereIsActive(true)
                ->whereOrganizationId($organizationId)
                ->select('id', 'name', 'code')
                ->get();
    }
}
