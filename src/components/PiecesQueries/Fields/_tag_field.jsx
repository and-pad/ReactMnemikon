import { Paper, TextField } from "@mui/material";

export const TagField = ({
  handleTagDelete,
  handleTagClick,
  handleTagKeyDown,
  tags,
  currentTag,
  handleInputChange,

  langData,
}) => {
  return (
    <>
      <Paper
        elevation={6}
        sx={{
          paddingLeft: 1,
          paddingRight: 1,
          paddingBottom: 1,
          paddingTop: 0.5,
          marginTop: 2,
          marginRight: -1,
          marginLeft: -1.5,
        }}
      >
        <div className="tags-input mt-2">
          
          {Array.isArray(tags) &&
          tags.filter(tag => tag.trim() !== "").map((tag, index) => (
            <span
              key={index}
              className="tag"
              onClick={() => handleTagClick(index)}
            >
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTagDelete(index);
                }}
                className="delete-tag"
              >
                x
              </button>
            </span>
          ))}

          <TextField
            className="mt-1"
            id="tags"
            variant="outlined"
            fullWidth
            label={langData.pieceDetailDescriptors.inventory.tags}
            size="small"
            multiline
            minRows={1}
            maxRows={200}
            value={currentTag}
            onChange={(e) => {
              handleInputChange(e);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Evita que Enter dispare el submit del formulario
                handleTagKeyDown(e); // Si aún quieres procesar Enter para agregar un tag, llama a tu función aquí
              }
            }}
          />
        </div>
      </Paper>
    </>
  );
};
