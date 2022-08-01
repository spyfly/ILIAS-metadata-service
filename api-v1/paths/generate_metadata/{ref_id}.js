// ./api-v1/paths/worlds.js
export default function(metadataGenerationService) {
    let operations = {
      GET
    };
  
    async function GET(req, res, next) {
      res.status(200).json(await metadataGenerationService.generateMetadata(req.params.ref_id));
    }
  
    // NOTE: We could also use a YAML string here.
    GET.apiDoc = {
      summary: 'Generates Metadata for ILIAS Learning Modules by reference id',
      operationId: 'generateMetadata',
      parameters: [
        {
          in: 'path',
          name: 'ref_id',
          required: true,
          type: 'integer'
        }
      ],
      responses: {
        200: {
          description: 'Generated metadata for the ILIAS Learning Module',
          schema: {
            type: 'object',
            items: {}
          }
        },
        default: {
          description: 'An error occurred',
          schema: {
            additionalProperties: true
          }
        }
      }
    };
  
    return operations;
  }