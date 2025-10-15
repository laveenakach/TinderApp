<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\People;
use App\Models\Like;
use App\Models\Dislike;
use Illuminate\Support\Facades\DB;
use Exception;

/**
 * @OA\Tag(
 *     name="People",
 *     description="Endpoints related to people recommendations and actions"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="sanctumAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="Sanctum"
 * )
 */
class PeopleController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/people",
     *     tags={"People"},
     *     summary="List of recommended people with pagination",
     *     security={{"sanctumAuth": {}}},
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         description="Number of people per page",
     *         required=false,
     *         @OA\Schema(type="integer", example=10)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of people",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Aarav Mehta"),
     *                     @OA\Property(property="age", type="integer", example=26),
     *                     @OA\Property(property="location", type="string", example="Mumbai"),
     *                     @OA\Property(property="pictures", type="array",
     *                         @OA\Items(type="string", example="https://randomuser.me/api/portraits/men/32.jpg")
     *                     )
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 20);
        $people = People::with('pictures')->paginate($perPage);
        return response()->json($people);
    }

    /**
     * @OA\Post(
     *     path="/api/people/{id}/like",
     *     tags={"People"},
     *     summary="Like a person",
     *     security={{"sanctumAuth": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID of the person to like",
     *         @OA\Schema(type="integer", example=5)
     *     ),
     *     @OA\Response(response=200, description="Successfully liked the person"),
     *     @OA\Response(response=404, description="Person not found"),
     *     @OA\Response(response=500, description="Server error")
     * )
     */
    public function like($id, Request $request)
    {
        $user = $request->user();
        $person = People::findOrFail($id);

        DB::beginTransaction();
        try {
            Like::firstOrCreate([
                'user_id' => $user->id,
                'people_id' => $person->id
            ]);

            // Remove from dislikes if exists
            Dislike::where([
                'user_id' => $user->id,
                'people_id' => $person->id
            ])->delete();

            DB::commit();

            return response()->json([
                'status' => 'liked',
                'user_id' => $user->id,
                'person_id' => $person->id
            ]);
        } catch (Exception $ex) {
            DB::rollBack();
            return response()->json(['error' => $ex->getMessage()], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/people/{id}/dislike",
     *     tags={"People"},
     *     summary="Dislike a person",
     *     security={{"sanctumAuth": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID of the person to dislike",
     *         @OA\Schema(type="integer", example=7)
     *     ),
     *     @OA\Response(response=200, description="Successfully disliked the person"),
     *     @OA\Response(response=404, description="Person not found"),
     *     @OA\Response(response=500, description="Server error")
     * )
     */
    public function dislike($id, Request $request)
    {
        $user = $request->user();

        Dislike::firstOrCreate([
            'user_id' => $user->id,
            'people_id' => $id
        ]);

        // Remove like if exists
        Like::where([
            'user_id' => $user->id,
            'people_id' => $id
        ])->delete();

        return response()->json(['status' => 'disliked'], 200);
    }

    /**
     * @OA\Get(
     *     path="/api/liked",
     *     tags={"People"},
     *     summary="List of people liked by the authenticated user",
     *     security={{"sanctumAuth": {}}},
     *     @OA\Response(response=200, description="List of liked people")
     * )
     */
    public function likedList(Request $request)
    {
        $user = $request->user();
        $likes = Like::where('user_id', $user->id)
            ->with('people.pictures')
            ->paginate(30);

        return response()->json($likes);
    }
}
