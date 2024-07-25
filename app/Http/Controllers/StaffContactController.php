<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;

class StaffContactController extends Controller
{
    protected $userRepository;

    protected $logRepository;

    public function __construct(UserRepository $userRepository, LogRepository $logRepository)
    {
        $this->userRepository = $userRepository;
        $this->logRepository = $logRepository;
    }
}
