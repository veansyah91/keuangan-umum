<?php

namespace App\Models;

use App\Models\Contact;
use App\Models\Journal;
use Illuminate\Database\Eloquent\Model;
use App\Models\StudentEntryPaymentCategory;
use App\Models\StudentEntryReceivableLedger;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class StudentEntryPayment extends Model
{
	use HasFactory;

	protected $fillable = [
		'organization_id',
		'contact_id',
		'created_by_id',
		'journal_id',
		'no_ref',
		'value',
		'date',
		'study_year',
		'receivable_value'
	];

	public function scopeFilter($query, $filters)
	{
		$query->when($filters['search'] ?? false, function ($query, $search) {
			return $query->where('no_ref', 'like', '%'.$search.'%')
										->orWhereHas('contact', function ($query) use ($search){
											$query->where('name', 'like', '%'. $search .'%')
														->orWhereHas('student', function ($query) use ($search){
															$query->where('no_ref', 'like', '%'. $search .'%');
														});
			});
		});
	}

	public function contact(): BelongsTo
	{
		return $this->belongsTo(Contact::class);
	}

	public function details(): BelongsToMany
	{
		return $this->belongsToMany(StudentEntryPaymentCategory::class, 's_yearly_payment_details', 'payment_id', 'student_payment_category_id')->withPivot('value');
	}

	public function receivables(): HasMany
	{
		return $this->hasMany(StudentEntryReceivableLedger::class, 'payment_id');
	}

	public function journal(): BelongsTo
	{
		return $this->belongsTo(Journal::class);
	}
}
