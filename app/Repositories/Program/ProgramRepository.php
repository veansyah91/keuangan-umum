<?php

namespace App\Repositories\Program;

use App\Models\Program;

class ProgramRepository implements ProgramRepositoryInterface
{
    public function getData($organizationId)
    {
        return Program::whereIsActive(true)
                ->whereOrganizationId($organizationId)
                ->select('id', 'name', 'code')
                ->get();
    }
}
