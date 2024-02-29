<?php

namespace App\Repositories\Journal;

interface JournalRepositoryInterface
{
    public function store($validated);
    public function update($validated, $journal);
}