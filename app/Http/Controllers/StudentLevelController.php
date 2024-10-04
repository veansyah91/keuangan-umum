<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\StudentLevel;
use Illuminate\Http\Request;

class StudentLevelController extends Controller
{
  public function update(Request $request, Organization $organization, StudentLevel $level)
	{
		$validated = $request->validate([
			'level' => 'required|numeric',
			'year' => 'required|string',
			'contact_id' => 'required|exists:contacts,id'
		]);

		// cek apakah data sudah ada
		$check = StudentLevel::where('contact_id', $validated['contact_id'])
													->where('level', $validated['level'])
													->where('year', $validated['year'])
													->first();

		if ($check) {
			if ($check['id'] !== $level['id']) {
				return redirect()->back()->withErrors(['year' => 'Data is existed', 'level' => 'Data is existed']);
			}
		}				

		$level->update($validated);

		return redirect()->back()->with('success', 'Kelas Siswa berhasil diperbarui');
	}
}
